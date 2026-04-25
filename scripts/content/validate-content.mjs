import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const repoRoot = process.cwd();
const questionBankPath = join(repoRoot, "src/data/questionBank.ts");
const questionBankDir = dirname(questionBankPath);
const appComponentPath = join(repoRoot, "src/components/PersiapanUkomApp.tsx");

function normalizeQuestion(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[‐‑‒–—]/g, "-")
    .replace(/[?!.]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function loadQuestionBankModule() {
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
      return require(join(questionBankDir, "waygroundQuestions.json"));
    }
    if (specifier === "./localQuestions.json") {
      const localQuestionsPath = join(questionBankDir, "localQuestions.json");
      return existsSync(localQuestionsPath) ? require(localQuestionsPath) : [];
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

  return cjsModule.exports;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const localQuestions = require(join(questionBankDir, "localQuestions.json"));
const { questionBank, studyPackages } = loadQuestionBankModule();
const errors = [];
const warnings = [];

function recordCheck(name, check) {
  try {
    check();
  } catch (error) {
    errors.push(`${name}: ${error.message}`);
  }
}

recordCheck("total question count", () => {
  const baselineQuestionCount = 500;
  const expectedTotal = baselineQuestionCount + localQuestions.length;

  assert(localQuestions.length === 53, `Expected 53 curated local questions, got ${localQuestions.length}.`);
  assert(questionBank.length === expectedTotal, `Expected ${expectedTotal} total questions after local import, got ${questionBank.length}.`);
});

recordCheck("four options and answer mapping", () => {
  for (const question of questionBank) {
    assert(Array.isArray(question.options) && question.options.length === 4, `${question.id} does not have exactly four options.`);
    assert(
      question.correctOptionIndex >= 0 && question.correctOptionIndex <= 3,
      `${question.id} has invalid correctOptionIndex ${question.correctOptionIndex}.`
    );
    assert(
      question.answer === question.options[question.correctOptionIndex],
      `${question.id} answer does not match options[correctOptionIndex].`
    );
  }
});

recordCheck("source metadata completeness", () => {
  for (const question of questionBank) {
    assert(question.source?.title, `${question.id} is missing source.title.`);
    assert(question.source?.url, `${question.id} is missing source.url.`);
    assert(question.source?.note, `${question.id} is missing source.note.`);
  }
});

recordCheck("no normalized duplicates per category", () => {
  const seen = new Map();

  for (const question of questionBank) {
    const key = `${question.categoryId}::${normalizeQuestion(question.question)}`;
    const existingId = seen.get(key);
    assert(!existingId, `${question.id} duplicates ${existingId} in category ${question.categoryId}.`);
    seen.set(key, question.id);
  }
});

recordCheck("package size cap", () => {
  for (const studyPackage of studyPackages) {
    assert(studyPackage.questions.length <= 20, `${studyPackage.id} has ${studyPackage.questions.length} questions.`);
  }
});

recordCheck("shared question bank import", () => {
  const appSource = readFileSync(appComponentPath, "utf8");
  assert(
    /import\s+\{\s*studyCategories,\s*studyPackages\s*\}\s+from\s+"@\/data\/questionBank";/.test(appSource),
    "PersiapanUkomApp does not import studyPackages from the shared question bank."
  );
  assert(!/waygroundQuestions|localQuestions/.test(appSource), "PersiapanUkomApp imports a raw question source directly.");
});

const byCategory = questionBank.reduce((counts, question) => {
  counts[question.categoryId] = (counts[question.categoryId] ?? 0) + 1;
  return counts;
}, {});
const packageSummary = studyPackages.reduce((counts, studyPackage) => {
  counts[studyPackage.categoryId] = (counts[studyPackage.categoryId] ?? 0) + 1;
  return counts;
}, {});

if (errors.length > 0) {
  console.error(JSON.stringify({ ok: false, errors, warnings }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  totals: {
    localQuestions: localQuestions.length,
    questionBank: questionBank.length,
    packages: studyPackages.length,
    maxPackageSize: Math.max(...studyPackages.map((studyPackage) => studyPackage.questions.length))
  },
  byCategory,
  packageSummary,
  warnings
}, null, 2));
