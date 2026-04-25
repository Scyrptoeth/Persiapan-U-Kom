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
    if (specifier === "./providedQuestionPackages.json") {
      const providedQuestionPackagesPath = join(questionBankDir, "providedQuestionPackages.json");
      return existsSync(providedQuestionPackagesPath) ? require(providedQuestionPackagesPath) : [];
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
const providedQuestionPackages = require(join(questionBankDir, "providedQuestionPackages.json"));
const { questionBank, studyPackages } = loadQuestionBankModule();
const errors = [];
const warnings = [];
const expectedLocalQuestionCount = 388;
const expectedProvidedPackageCount = 49;
const expectedProvidedQuestionCount = 980;
const expectedAnswerKeyQuestionCount = 277;
const answerKeySourceTitle = "jawaban-soal-unresolved-281.xlsx";
const answerKeySourceUrl = "/Users/persiapantubel/Downloads/Persiapan U-Kom/Soal-Unresolved/jawaban-soal-unresolved-281.xlsx";

function recordCheck(name, check) {
  try {
    check();
  } catch (error) {
    errors.push(`${name}: ${error.message}`);
  }
}

recordCheck("total question count", () => {
  const baselineQuestionCount = 500;
  const providedQuestionCount = providedQuestionPackages.reduce((total, studyPackage) => total + studyPackage.questions.length, 0);
  const expectedTotal = baselineQuestionCount + localQuestions.length + providedQuestionCount;

  assert(localQuestions.length === expectedLocalQuestionCount, `Expected ${expectedLocalQuestionCount} curated local questions, got ${localQuestions.length}.`);
  assert(providedQuestionPackages.length === expectedProvidedPackageCount, `Expected ${expectedProvidedPackageCount} provided PDF packages, got ${providedQuestionPackages.length}.`);
  assert(providedQuestionCount === expectedProvidedQuestionCount, `Expected ${expectedProvidedQuestionCount} provided PDF questions, got ${providedQuestionCount}.`);
  assert(questionBank.length === expectedTotal, `Expected ${expectedTotal} total questions after local import, got ${questionBank.length}.`);
});

recordCheck("provided PDF packages", () => {
  const studyPackageById = new Map(studyPackages.map((studyPackage) => [studyPackage.id, studyPackage]));

  for (const providedPackage of providedQuestionPackages) {
    assert(providedPackage.questions.length === 20, `${providedPackage.id} should contain exactly 20 source questions.`);
    assert(/-paket-[a-z]$/.test(providedPackage.id), `${providedPackage.id} should use alphabetic package id.`);
    assert(/ Paket [A-Z]$/.test(providedPackage.name), `${providedPackage.id} should use alphabetic display name.`);
    const renderedPackage = studyPackageById.get(providedPackage.id);
    assert(renderedPackage, `${providedPackage.id} is missing from studyPackages.`);
    assert(renderedPackage.questions.length === 20, `${providedPackage.id} should render exactly 20 questions.`);

    for (const [index, question] of providedPackage.questions.entries()) {
      assert(question.providedPackage?.id === providedPackage.id, `${providedPackage.id} question ${index + 1} is missing providedPackage metadata.`);
      assert(question.providedPackage.questionNumber === index + 1, `${providedPackage.id} question ${index + 1} has wrong providedPackage question number.`);
      assert(question.source?.title === providedPackage.sourceTitle, `${providedPackage.id} question ${index + 1} has unexpected source title.`);
      assert(question.source?.url === providedPackage.sourceUrl, `${providedPackage.id} question ${index + 1} has unexpected source URL.`);
    }
  }
});

recordCheck("four options and answer mapping", () => {
  for (const question of questionBank) {
    assert(Array.isArray(question.options) && question.options.length === 4, `${question.id} does not have exactly four options.`);
    if (question.providedPackage) {
      assert(new Set(question.options).size === 4, `${question.id} has duplicate options.`);
    }
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

recordCheck("unresolved answer key import", () => {
  const answerKeyQuestions = localQuestions.filter((question) => question.source?.title === answerKeySourceTitle);
  assert(
    answerKeyQuestions.length === expectedAnswerKeyQuestionCount,
    `Expected ${expectedAnswerKeyQuestionCount} unresolved answer-key questions, got ${answerKeyQuestions.length}.`
  );

  for (const question of answerKeyQuestions) {
    assert(question.source.url === answerKeySourceUrl, `${question.question} has unexpected answer-key source URL.`);
    assert(/Kunci Excel baris \d+; soal-unresolved-281\.pdf soal \d+\/281; PDF asal .+ nomor \d+\./.test(question.source.note), `${question.question} has incomplete answer-key note.`);
    assert(!/soal 274\/281|soal 275\/281/.test(question.source.note), `${question.question} should not import skipped unresolved item 274/275.`);
  }
});

recordCheck("no Microsoft Forms footer noise", () => {
  const footerPattern = /Never give out your password|Microsoft Forms|privacy and security practices/i;

  for (const question of questionBank) {
    assert(!footerPattern.test(question.question), `${question.id} question contains Microsoft Forms footer noise.`);
    for (const option of question.options) {
      assert(!footerPattern.test(option), `${question.id} option contains Microsoft Forms footer noise.`);
    }
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
    providedQuestionPackages: providedQuestionPackages.length,
    providedQuestions: providedQuestionPackages.reduce((total, studyPackage) => total + studyPackage.questions.length, 0),
    questionBank: questionBank.length,
    packages: studyPackages.length,
    maxPackageSize: Math.max(...studyPackages.map((studyPackage) => studyPackage.questions.length))
  },
  byCategory,
  packageSummary,
  warnings
}, null, 2));
