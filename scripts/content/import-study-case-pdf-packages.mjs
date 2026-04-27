import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const repoRoot = process.cwd();
const sourceRoot = "/Users/persiapantubel/Downloads/Persiapan U-Kom/Soal-Sudah-Ada-Jawaban-Studi-Kasus";
const cacheRoot = join(repoRoot, ".local-content-cache");
const outputPath = join(repoRoot, "src/data/providedQuestionPackages.json");
const reportPath = join(cacheRoot, "study-case-pdf-package-import-report.json");

const answerIndexByLetter = new Map([
  ["A", 0],
  ["B", 1],
  ["C", 2],
  ["D", 3]
]);

const sourceFiles = [
  {
    fileName: "2 Paket Baru BM (Studi Kasus).pdf",
    categoryId: "bea-meterai",
    topicPrefix: "BM",
    expectedPackages: 2
  },
  {
    fileName: "2 Paket Baru KUP (Studi Kasus).pdf",
    categoryId: "kup",
    topicPrefix: "KUP",
    expectedPackages: 2
  },
  {
    fileName: "3 Paket Baru IK (Studi Kasus).pdf",
    categoryId: "internalisasi-kepatuhan",
    topicPrefix: "IK",
    expectedPackages: 3
  },
  {
    fileName: "3 Paket Baru NILAI (Studi Kasus).pdf",
    categoryId: "nilai-kemenkeu",
    topicPrefix: "NILAI",
    expectedPackages: 3
  },
  {
    fileName: "3 Paket Baru ORG (Studi Kasus).pdf",
    categoryId: "organisasi",
    topicPrefix: "ORG",
    expectedPackages: 3
  },
  {
    fileName: "3 Paket Baru PBB (Studi Kasus).pdf",
    categoryId: "pbb",
    topicPrefix: "PBB",
    expectedPackages: 3
  },
  {
    fileName: "3 Paket Baru PEG (Studi Kasus).pdf",
    categoryId: "kepegawaian",
    topicPrefix: "PEG",
    expectedPackages: 3
  },
  {
    fileName: "3 Paket Baru PPH (Studi Kasus).pdf",
    categoryId: "pph",
    topicPrefix: "PPH",
    expectedPackages: 3
  },
  {
    fileName: "3 Paket Baru PPN (Studi Kasus).pdf",
    categoryId: "ppn",
    topicPrefix: "PPN",
    expectedPackages: 3
  }
];

function getPdfText(path) {
  return execFileSync("pdftotext", ["-layout", path, "-"], {
    encoding: "utf8",
    maxBuffer: 96 * 1024 * 1024
  });
}

function normalizeLine(line) {
  return line
    .replace(/\f/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/\u00ad/g, "")
    .replace(/[‐‑‒–—]/g, "-")
    .replace(/\s+$/g, "")
    .trim();
}

function normalizeText(value) {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/\u00ad/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function joinPdfLine(currentValue, nextLine) {
  if (!currentValue) {
    return nextLine;
  }

  if (!nextLine) {
    return currentValue;
  }

  if (/[-/]$/.test(currentValue)) {
    return `${currentValue}${nextLine}`;
  }

  return `${currentValue} ${nextLine}`;
}

function punctuate(value) {
  const trimmed = value.trim();
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function formatExplanation(answerLetter, sourceExplanation) {
  const explanation = normalizeText(sourceExplanation);
  if (new RegExp(`^Jawaban\\s+${answerLetter}\\s+benar\\b`, "i").test(explanation)) {
    return explanation;
  }

  return `Jawaban ${answerLetter} benar. ${punctuate(explanation)}`;
}

function createEmptyPackage(sourceLabel) {
  return {
    sourceLabel,
    questions: [],
    warnings: []
  };
}

function appendToCurrentQuestion(currentQuestion, value, currentField) {
  if (!currentQuestion || !value) {
    return;
  }

  if (currentField.type === "option" && currentQuestion.options.length > 0) {
    const lastIndex = currentQuestion.options.length - 1;
    currentQuestion.options[lastIndex] = joinPdfLine(currentQuestion.options[lastIndex], value);
    return;
  }

  if (currentField.type === "explanation") {
    currentQuestion.explanation = joinPdfLine(currentQuestion.explanation, value);
    return;
  }

  currentQuestion.question = joinPdfLine(currentQuestion.question, value);
}

function parseStudyCasePdf(config) {
  const sourcePath = join(sourceRoot, config.fileName);
  const text = getPdfText(sourcePath);
  const lines = text.split(/\r?\n/).map(normalizeLine);
  const packages = [];
  let currentPackage = null;
  let currentQuestion = null;
  const currentField = { type: "question" };

  function startPackage(sourceLabel) {
    finishQuestion();
    currentPackage = createEmptyPackage(sourceLabel);
    packages.push(currentPackage);
    currentField.type = "question";
  }

  function ensurePackage() {
    if (!currentPackage) {
      startPackage(String(packages.length + 1));
    }

    return currentPackage;
  }

  function finishQuestion() {
    if (!currentQuestion) {
      return;
    }

    const targetPackage = ensurePackage();
    currentQuestion.question = normalizeText(currentQuestion.question);
    currentQuestion.options = currentQuestion.options.map(normalizeText);
    currentQuestion.explanation = normalizeText(currentQuestion.explanation);
    targetPackage.questions.push(currentQuestion);
    currentQuestion = null;
    currentField.type = "question";
  }

  const packageHeadingPattern = new RegExp(
    `^${config.topicPrefix}\\s*\\((?:STUDI\\s+KASUS|Studi\\s+Kasus|Kasus)\\)\\s+Paket\\s+([A-Z0-9]+)\\b`,
    "i"
  );

  for (const line of lines) {
    if (!line || line === "---") {
      continue;
    }

    const packageMatch = line.match(packageHeadingPattern);
    if (packageMatch) {
      startPackage(packageMatch[1]);
      continue;
    }

    const soalMatch = line.match(/^Soal\s+(\d{1,3})\b\s*(.*)$/i);
    if (soalMatch) {
      finishQuestion();
      ensurePackage();
      currentQuestion = {
        sourceOrdinal: Number(soalMatch[1]),
        question: soalMatch[2] || "",
        options: [],
        answerLetter: null,
        explanation: ""
      };
      currentField.type = "question";
      continue;
    }

    const numberedQuestionMatch = line.match(/^(\d{1,3})\.\s+(.+)$/);
    const isNextNumberedQuestion =
      numberedQuestionMatch &&
      (!currentQuestion || currentField.type === "explanation") &&
      (!currentQuestion || Number(numberedQuestionMatch[1]) === currentQuestion.sourceOrdinal + 1);

    if (isNextNumberedQuestion) {
      finishQuestion();
      ensurePackage();
      currentQuestion = {
        sourceOrdinal: Number(numberedQuestionMatch[1]),
        question: numberedQuestionMatch[2],
        options: [],
        answerLetter: null,
        explanation: ""
      };
      currentField.type = "question";
      continue;
    }

    const answerMatch = line.match(/^Kunci\s+Jawaban\s*:\s*([A-D])\b/i);
    if (answerMatch && currentQuestion) {
      currentQuestion.answerLetter = answerMatch[1].toUpperCase();
      currentField.type = "explanation";
      continue;
    }

    const optionMatch = line.match(/^([A-D])\.\s+(.+)$/);
    if (optionMatch && currentQuestion && currentField.type !== "explanation") {
      currentQuestion.options.push(optionMatch[2]);
      currentField.type = "option";
      continue;
    }

    appendToCurrentQuestion(currentQuestion, line, currentField);
  }

  finishQuestion();

  const validationErrors = [];
  if (packages.length !== config.expectedPackages) {
    validationErrors.push(`${config.fileName}: expected ${config.expectedPackages} packages, got ${packages.length}.`);
  }

  packages.forEach((questionPackage, packageIndex) => {
    if (questionPackage.questions.length !== 20) {
      validationErrors.push(
        `${config.fileName} Paket ${packageIndex + 1}: expected 20 questions, got ${questionPackage.questions.length}.`
      );
    }

    questionPackage.questions.forEach((question, questionIndex) => {
      if (!question.question) {
        validationErrors.push(`${config.fileName} Paket ${packageIndex + 1} soal ${questionIndex + 1}: empty question.`);
      }
      if (question.options.length !== 4 || question.options.some((option) => !option)) {
        validationErrors.push(
          `${config.fileName} Paket ${packageIndex + 1} soal ${questionIndex + 1}: expected 4 options, got ${question.options.length}.`
        );
      }
      if (!answerIndexByLetter.has(question.answerLetter)) {
        validationErrors.push(
          `${config.fileName} Paket ${packageIndex + 1} soal ${questionIndex + 1}: missing answer letter.`
        );
      }
      if (!question.explanation) {
        validationErrors.push(`${config.fileName} Paket ${packageIndex + 1} soal ${questionIndex + 1}: missing explanation.`);
      }
    });
  });

  if (validationErrors.length > 0) {
    const error = new Error(`Failed to parse ${config.fileName}`);
    error.validationErrors = validationErrors;
    throw error;
  }

  return packages.map((questionPackage, packageIndex) => {
    const packageLabel = String(packageIndex + 1);
    const packageId = `${config.categoryId}-studi-kasus-paket-${packageLabel}`;
    const packageName = `${config.topicPrefix} (Studi Kasus) Paket ${packageLabel}`;

    return {
      id: packageId,
      categoryId: config.categoryId,
      name: packageName,
      sourceTitle: config.fileName,
      sourceUrl: sourcePath,
      packageLabel,
      packageIndex,
      sourcePackageLabel: questionPackage.sourceLabel,
      questions: questionPackage.questions.map((question, questionIndex) => {
        const correctOptionIndex = answerIndexByLetter.get(question.answerLetter);
        const answer = question.options[correctOptionIndex];
        const sourceNote = `${config.fileName} Paket ${packageLabel} soal ${questionIndex + 1}/20; nomor sumber ${question.sourceOrdinal}; kunci jawaban ${question.answerLetter}; label paket sumber ${questionPackage.sourceLabel}.`;

        return {
          categoryId: config.categoryId,
          topic: packageName,
          question: question.question,
          answer,
          options: question.options,
          correctOptionIndex,
          explanation: formatExplanation(question.answerLetter, question.explanation),
          source: {
            title: config.fileName,
            url: sourcePath,
            note: sourceNote
          },
          providedPackage: {
            id: packageId,
            label: packageLabel,
            order: packageIndex,
            questionNumber: questionIndex + 1,
            sourceTitle: config.fileName
          }
        };
      })
    };
  });
}

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

const report = {
  sources: [],
  totals: {
    packages: 0,
    questions: 0
  }
};
const importedPackages = [];
const errors = [];

for (const config of sourceFiles) {
  try {
    const parsedPackages = parseStudyCasePdf(config);
    importedPackages.push(...parsedPackages);
    report.sources.push({
      fileName: config.fileName,
      categoryId: config.categoryId,
      expectedPackages: config.expectedPackages,
      parsedPackages: parsedPackages.length,
      parsedQuestions: parsedPackages.reduce((total, questionPackage) => total + questionPackage.questions.length, 0),
      packageLabels: parsedPackages.map((questionPackage) => questionPackage.packageLabel)
    });
  } catch (error) {
    errors.push(...(error.validationErrors ?? [`${config.fileName}: ${error.message}`]));
  }
}

report.totals.packages = importedPackages.length;
report.totals.questions = importedPackages.reduce((total, questionPackage) => total + questionPackage.questions.length, 0);

const importedSourceTitles = new Set(sourceFiles.map((sourceFile) => sourceFile.fileName));
const existingPackages = existsSync(outputPath) ? JSON.parse(readFileSync(outputPath, "utf8")) : [];
const preservedPackages = existingPackages.filter((questionPackage) => !importedSourceTitles.has(questionPackage.sourceTitle));
const nextPackages = [...preservedPackages, ...importedPackages];
const packageIds = new Set();
const normalizedQuestionsByCategory = new Map();

for (const questionPackage of nextPackages) {
  if (packageIds.has(questionPackage.id)) {
    errors.push(`Duplicate package id after study-case import: ${questionPackage.id}.`);
  }
  packageIds.add(questionPackage.id);

  for (const question of questionPackage.questions) {
    const normalizedKey = `${question.categoryId}::${normalizeQuestion(question.question)}`;
    const existingQuestion = normalizedQuestionsByCategory.get(normalizedKey);
    if (existingQuestion) {
      errors.push(
        `Duplicate normalized question after study-case import in ${question.categoryId}: ${questionPackage.id} duplicates ${existingQuestion}.`
      );
    }
    normalizedQuestionsByCategory.set(normalizedKey, questionPackage.id);
  }
}

mkdirSync(cacheRoot, { recursive: true });
writeFileSync(reportPath, `${JSON.stringify({ ...report, preservedPackages: preservedPackages.length, errors }, null, 2)}\n`);

if (errors.length > 0) {
  console.error(JSON.stringify({ ok: false, errors, reportPath }, null, 2));
  process.exit(1);
}

writeFileSync(outputPath, `${JSON.stringify(nextPackages, null, 2)}\n`);
console.log(JSON.stringify({
  ok: true,
  outputPath,
  reportPath,
  importedPackages: report.totals.packages,
  importedQuestions: report.totals.questions,
  preservedPackages: preservedPackages.length,
  packages: nextPackages.length,
  questions: nextPackages.reduce((total, questionPackage) => total + questionPackage.questions.length, 0),
  sources: report.sources.map((source) => ({
    fileName: basename(source.fileName),
    packages: source.parsedPackages,
    questions: source.parsedQuestions
  }))
}, null, 2));
