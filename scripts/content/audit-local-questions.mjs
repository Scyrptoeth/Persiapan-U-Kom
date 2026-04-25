import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const repoRoot = process.cwd();
const cacheRoot = join(repoRoot, ".local-content-cache");
const questionBankPath = join(repoRoot, "src/data/questionBank.ts");
const sourceDataDir = dirname(questionBankPath);

const negativeQuestionPattern = /\b(kecuali|bukan|tidak|belum|tanpa|selain|yang tidak|tidak termasuk|tidak mencakup)\b/i;
const weakOptionPattern = /^(ya|tidak|benar|salah|semua benar|semua jawaban benar|tidak ada jawaban yang benar)$/i;

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function normalizeQuestion(value) {
  return normalizeSearch(value)
    .replace(/[?!.]+$/g, "")
    .replace(/\bberapakah\b/g, "berapa")
    .replace(/\bapakah\b/g, "apa");
}

function normalizeSearch(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[‐‑‒–—]/g, "-")
    .replace(/[“”]/g, "\"")
    .replace(/[’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getTextPages(path) {
  const text = execFileSync("pdftotext", ["-layout", path, "-"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  return text.split("\f").map((pageText, index) => ({
    page: index + 1,
    text: pageText,
    normalizedText: normalizeSearch(pageText)
  }));
}

function loadQuestionBank() {
  const source = readFileSync(questionBankPath, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      resolveJsonModule: true,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES2022
    },
    fileName: questionBankPath
  }).outputText;
  const cjsModule = { exports: {} };
  const customRequire = (specifier) => {
    if (specifier === "./waygroundQuestions.json") {
      return require(join(sourceDataDir, "waygroundQuestions.json"));
    }
    if (specifier === "./localQuestions.json") {
      const path = join(sourceDataDir, "localQuestions.json");
      return existsSync(path) ? require(path) : [];
    }
    if (specifier.startsWith("@/types/")) {
      return {};
    }
    return require(specifier);
  };

  vm.runInNewContext(compiled, {
    exports: cjsModule.exports,
    module: cjsModule,
    require: customRequire
  }, { filename: questionBankPath });

  return cjsModule.exports.questionBank;
}

function countExactHits(option, pageIndexes) {
  const normalizedOption = normalizeSearch(option);
  if (normalizedOption.length < 3 || weakOptionPattern.test(normalizedOption)) {
    return [];
  }

  const pattern = new RegExp(`(^|\\W)${escapeRegExp(normalizedOption)}(\\W|$)`, "i");
  const hits = [];

  for (const pageIndex of pageIndexes) {
    for (const page of pageIndex.pages) {
      if (pattern.test(page.normalizedText)) {
        hits.push({
          materialPath: pageIndex.path,
          materialTitle: pageIndex.title,
          page: page.page
        });
      }
    }
  }

  return hits;
}

const extractedQuestions = readJson(join(cacheRoot, "extracted-questions.json"));
const materialInventory = readJson(join(cacheRoot, "material-pdfs.json"));
const existingQuestions = loadQuestionBank();
const existingByCategoryQuestion = new Set(
  existingQuestions.map((question) => `${question.categoryId}::${normalizeQuestion(question.question)}`)
);
const materialPagesByCategory = new Map();

for (const material of materialInventory) {
  if (!materialPagesByCategory.has(material.categoryId)) {
    materialPagesByCategory.set(material.categoryId, []);
  }

  materialPagesByCategory.get(material.categoryId).push({
    path: material.path,
    title: material.fileName,
    pages: getTextPages(material.path)
  });
}

const auditedQuestions = extractedQuestions.map((question) => {
  const normalizedKey = `${question.categoryId}::${normalizeQuestion(question.question)}`;
  const hasFourOptions = Array.isArray(question.options) && question.options.length === 4 && question.options.every(Boolean);

  if (!hasFourOptions) {
    return {
      ...question,
      status: "invalid-format",
      reason: "Question does not have exactly four parsed options."
    };
  }

  if (existingByCategoryQuestion.has(normalizedKey)) {
    return {
      ...question,
      status: "duplicate",
      reason: "Normalized question text already exists in the same category."
    };
  }

  const materialPages = materialPagesByCategory.get(question.categoryId) ?? [];
  const optionHits = question.options.map((option, index) => ({
    optionIndex: index,
    option,
    hits: countExactHits(option, materialPages)
  }));
  const hitOptions = optionHits.filter((optionHit) => optionHit.hits.length > 0);
  const hasNegativePattern = negativeQuestionPattern.test(question.question);

  if (!hasNegativePattern && hitOptions.length === 1) {
    const winningOption = hitOptions[0];
    const hit = winningOption.hits[0];

    return {
      ...question,
      status: "valid-local-exact",
      correctOptionIndex: winningOption.optionIndex,
      answer: winningOption.option,
      verification: {
        method: "unique exact option phrase found in local material",
        materialTitle: hit.materialTitle,
        materialPath: hit.materialPath,
        page: hit.page
      },
      optionHits
    };
  }

  return {
    ...question,
    status: "unresolved",
    reason: hasNegativePattern
      ? "Question contains a negative/exception pattern and was not auto-answered."
      : hitOptions.length === 0
        ? "No option phrase was found exactly in local material."
        : "Multiple option phrases were found in local material.",
    optionHits
  };
});

const summary = auditedQuestions.reduce((counts, question) => {
  counts[question.status] = (counts[question.status] ?? 0) + 1;
  return counts;
}, {});
const byCategory = auditedQuestions.reduce((counts, question) => {
  counts[question.categoryId] ??= {};
  counts[question.categoryId][question.status] = (counts[question.categoryId][question.status] ?? 0) + 1;
  return counts;
}, {});

const result = {
  summary,
  byCategory,
  validQuestions: auditedQuestions.filter((question) => question.status === "valid-local-exact"),
  unresolvedQuestions: auditedQuestions.filter((question) => question.status === "unresolved"),
  skippedQuestions: auditedQuestions.filter((question) => question.status === "duplicate" || question.status === "invalid-format")
};

mkdirSync(cacheRoot, { recursive: true });
writeFileSync(join(cacheRoot, "local-question-audit.json"), `${JSON.stringify(result, null, 2)}\n`);

console.log(JSON.stringify({
  summary,
  byCategory,
  sampleValid: result.validQuestions.slice(0, 5).map((question) => ({
    categoryId: question.categoryId,
    ordinal: question.ordinal,
    sourceTitle: question.sourceTitle,
    answer: question.answer,
    verification: {
      materialTitle: question.verification.materialTitle,
      page: question.verification.page
    }
  })),
  sampleUnresolved: result.unresolvedQuestions.slice(0, 5).map((question) => ({
    categoryId: question.categoryId,
    ordinal: question.ordinal,
    sourceTitle: question.sourceTitle,
    reason: question.reason
  }))
}, null, 2));
