import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const repoRoot = process.cwd();
const sourceRoot = "/Users/persiapantubel/Downloads/Persiapan U-Kom/Soal-Sudah-Ada-Jawaban";
const cacheRoot = join(repoRoot, ".local-content-cache");
const outputPath = join(repoRoot, "src/data/providedQuestionPackages.json");
const reportPath = join(cacheRoot, "answered-pdf-package-import-report.json");

const answerIndexByLetter = new Map([
  ["A", 0],
  ["B", 1],
  ["C", 2],
  ["D", 3]
]);

const sourceFiles = [
  {
    fileName: "2-paket-baru-tnd.pdf",
    categoryId: "tata-naskah-dinas",
    topicPrefix: "TND",
    keyMode: "inline",
    expectedPackages: 2
  },
  {
    fileName: "3-paket-baru-ik.pdf",
    categoryId: "internalisasi-kepatuhan",
    topicPrefix: "IK",
    keyMode: "block",
    expectedPackages: 3
  },
  {
    fileName: "3-paket-baru-kup.pdf",
    categoryId: "kup",
    topicPrefix: "KUP",
    keyMode: "inline",
    expectedPackages: 4
  },
  {
    fileName: "3-paket-baru-materi-level-2.pdf",
    categoryId: "penelaah-keberatan",
    topicPrefix: "Materi Level 2",
    keyMode: "inline",
    expectedPackages: 3
  },
  {
    fileName: "3-paket-baru-nilai.pdf",
    categoryId: "nilai-kemenkeu",
    topicPrefix: "Nilai",
    keyMode: "block",
    expectedPackages: 3
  },
  {
    fileName: "3-paket-baru-org.pdf",
    categoryId: "organisasi",
    topicPrefix: "Org",
    keyMode: "block",
    expectedPackages: 4
  },
  {
    fileName: "3-paket-baru-pbb.pdf",
    categoryId: "pbb",
    topicPrefix: "PBB",
    keyMode: "block",
    expectedPackages: 3
  },
  {
    fileName: "4-paket-baru-bm.pdf",
    categoryId: "bea-meterai",
    topicPrefix: "BM",
    keyMode: "block",
    expectedPackages: 4
  },
  {
    fileName: "4-paket-baru-materi-level-1.pdf",
    categoryId: "account-representative",
    topicPrefix: "Materi Level 1",
    keyMode: "inline",
    expectedPackages: 4
  },
  {
    fileName: "4-paket-baru-peg.pdf",
    categoryId: "kepegawaian",
    topicPrefix: "Peg",
    keyMode: "block",
    expectedPackages: 4
  },
  {
    fileName: "4-paket-baru-tik.pdf",
    categoryId: "tik",
    topicPrefix: "TIK",
    keyMode: "block",
    expectedPackages: 4
  },
  {
    fileName: "5-paket-baru-pph.pdf",
    categoryId: "pph",
    topicPrefix: "PPh",
    keyMode: "inline",
    expectedPackages: 5
  },
  {
    fileName: "6-paket-baru-ppn.pdf",
    categoryId: "ppn",
    topicPrefix: "PPN",
    keyMode: "block",
    expectedPackages: 6
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

function punctuate(value) {
  const trimmed = value.trim();
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function getPackageLabel(index) {
  return String.fromCharCode("A".charCodeAt(0) + index);
}

function createEmptyPackage(label) {
  return {
    packageLabel: label,
    questions: [],
    blockAnswers: [],
    warnings: []
  };
}

function appendToCurrentQuestion(currentQuestion, value, currentField) {
  if (!currentQuestion || !value) {
    return;
  }

  if (currentField.type === "option" && currentQuestion.options.length > 0) {
    const lastIndex = currentQuestion.options.length - 1;
    currentQuestion.options[lastIndex] = normalizeText(`${currentQuestion.options[lastIndex]} ${value}`);
    return;
  }

  currentQuestion.question = normalizeText(`${currentQuestion.question} ${value}`);
}

function parseAnsweredPdf(config) {
  const sourcePath = join(sourceRoot, config.fileName);
  const text = getPdfText(sourcePath);
  const lines = text.split(/\r?\n/).map(normalizeLine);
  const packages = [];
  let currentPackage = null;
  let currentQuestion = null;
  let mode = "questions";
  const currentField = { type: "question" };

  function ensurePackage() {
    if (!currentPackage) {
      currentPackage = createEmptyPackage(getPackageLabel(packages.length));
      packages.push(currentPackage);
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
    targetPackage.questions.push(currentQuestion);
    currentQuestion = null;
    currentField.type = "question";
  }

  function startPackage(sourceLabel) {
    finishQuestion();
    const packageLabel = getPackageLabel(packages.length);
    currentPackage = createEmptyPackage(packageLabel);
    currentPackage.sourceLabel = sourceLabel;
    if (sourceLabel !== packageLabel) {
      currentPackage.warnings.push(`PDF heading label ${sourceLabel} normalized to Paket ${packageLabel}.`);
    }
    packages.push(currentPackage);
    mode = "questions";
    currentField.type = "question";
  }

  for (const line of lines) {
    if (!line || line === "---") {
      continue;
    }

    const packageMatch = line.match(/^PAKET\s+([A-Z])\b/i);
    if (packageMatch) {
      startPackage(packageMatch[1].toUpperCase());
      continue;
    }

    const inlineAnswerMatch = line.match(/^(?:Kunci\s+)?Jawaban\s*:\s*([A-D])\.?$/i);
    if (inlineAnswerMatch && mode === "questions") {
      if (!currentQuestion) {
        ensurePackage().warnings.push(`Answer line without active question: ${line}`);
        continue;
      }

      currentQuestion.answerLetter = inlineAnswerMatch[1].toUpperCase();
      finishQuestion();
      continue;
    }

    if (/^KUNCI\s+JAWABAN(?:\s+SESI\s+\d+)?\s*:?\s*$/i.test(line) || /^Kunci\s+Jawaban(?:\s+Sesi\s+\d+)?\s*:?\s*$/i.test(line)) {
      finishQuestion();
      mode = "answers";
      currentField.type = "answer";
      continue;
    }

    if (mode === "answers") {
      const answerMatch = line.match(/^(\d{1,3})\.\s*([A-D])[\s.,;:]*$/i);
      if (answerMatch) {
        ensurePackage().blockAnswers.push({
          sourceOrdinal: Number(answerMatch[1]),
          answerLetter: answerMatch[2].toUpperCase()
        });
      }

      continue;
    }

    const questionMatch = line.match(/^(\d{1,3})\.\s+(.+)$/);
    if (questionMatch) {
      finishQuestion();
      ensurePackage();
      currentQuestion = {
        sourceOrdinal: Number(questionMatch[1]),
        question: questionMatch[2],
        options: [],
        answerLetter: null
      };
      currentField.type = "question";
      continue;
    }

    const optionMatch = line.match(/^([A-D])\.\s+(.+)$/);
    if (optionMatch && currentQuestion) {
      currentQuestion.options.push(optionMatch[2]);
      currentField.type = "option";
      continue;
    }

    appendToCurrentQuestion(currentQuestion, line, currentField);
  }

  finishQuestion();

  for (const questionPackage of packages) {
    if (config.keyMode === "block") {
      const answersByOrdinal = new Map(
        questionPackage.blockAnswers.map((answer) => [answer.sourceOrdinal, answer.answerLetter])
      );

      if (answersByOrdinal.size === questionPackage.questions.length) {
        for (const question of questionPackage.questions) {
          question.answerLetter = answersByOrdinal.get(question.sourceOrdinal) ?? null;
        }
      } else {
        questionPackage.blockAnswers.forEach((answer, index) => {
          if (questionPackage.questions[index]) {
            questionPackage.questions[index].answerLetter = answer.answerLetter;
          }
        });
        questionPackage.warnings.push(
          `Answer ordinal mapping fallback used: ${questionPackage.blockAnswers.length} keys for ${questionPackage.questions.length} questions.`
        );
      }
    }
  }

  const validationErrors = [];
  if (packages.length !== config.expectedPackages) {
    validationErrors.push(`${config.fileName}: expected ${config.expectedPackages} packages, got ${packages.length}.`);
  }

  packages.forEach((questionPackage, packageIndex) => {
    if (questionPackage.questions.length !== 20) {
      validationErrors.push(
        `${config.fileName} Paket ${questionPackage.packageLabel}: expected 20 questions, got ${questionPackage.questions.length}.`
      );
    }

    questionPackage.questions.forEach((question, questionIndex) => {
      if (!question.question) {
        validationErrors.push(`${config.fileName} Paket ${questionPackage.packageLabel} soal ${questionIndex + 1}: empty question.`);
      }
      if (question.options.length !== 4 || question.options.some((option) => !option)) {
        validationErrors.push(
          `${config.fileName} Paket ${questionPackage.packageLabel} soal ${questionIndex + 1}: expected 4 options, got ${question.options.length}.`
        );
      }
      if (!answerIndexByLetter.has(question.answerLetter)) {
        validationErrors.push(
          `${config.fileName} Paket ${questionPackage.packageLabel} soal ${questionIndex + 1}: missing answer letter.`
        );
      }
    });
  });

  if (validationErrors.length > 0) {
    const error = new Error(`Failed to parse ${config.fileName}`);
    error.validationErrors = validationErrors;
    throw error;
  }

  return packages.map((questionPackage, packageIndex) => {
    return {
      id: `${config.categoryId}-paket-${questionPackage.packageLabel.toLowerCase()}`,
      categoryId: config.categoryId,
      name: `${config.topicPrefix} Paket ${questionPackage.packageLabel}`,
      sourceTitle: config.fileName,
      sourceUrl: sourcePath,
      packageLabel: questionPackage.packageLabel,
      packageIndex,
      questions: questionPackage.questions.map((question, questionIndex) => {
        const correctOptionIndex = answerIndexByLetter.get(question.answerLetter);
        const answer = question.options[correctOptionIndex];
        const sourceNote = `${config.fileName} Paket ${questionPackage.packageLabel} soal ${questionIndex + 1}/20; nomor sumber ${question.sourceOrdinal}; kunci jawaban ${question.answerLetter}.`;

        return {
          categoryId: config.categoryId,
          topic: `${config.topicPrefix} Paket ${questionPackage.packageLabel}`,
          question: question.question,
          answer,
          options: question.options,
          correctOptionIndex,
          explanation: `Jawaban yang benar adalah ${punctuate(answer)} Kunci jawaban bersumber dari ${config.fileName} Paket ${questionPackage.packageLabel} soal ${questionIndex + 1}.`,
          source: {
            title: config.fileName,
            url: sourcePath,
            note: sourceNote
          },
          providedPackage: {
            id: `${config.categoryId}-paket-${questionPackage.packageLabel.toLowerCase()}`,
            label: questionPackage.packageLabel,
            order: packageIndex,
            questionNumber: questionIndex + 1,
            sourceTitle: config.fileName
          }
        };
      })
    };
  });
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
    const parsedPackages = parseAnsweredPdf(config);
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
const preservedPackages = existsSync(outputPath)
  ? JSON.parse(readFileSync(outputPath, "utf8")).filter((questionPackage) => !importedSourceTitles.has(questionPackage.sourceTitle))
  : [];

mkdirSync(cacheRoot, { recursive: true });
writeFileSync(reportPath, `${JSON.stringify({ ...report, preservedPackages: preservedPackages.length, errors }, null, 2)}\n`);

if (errors.length > 0) {
  console.error(JSON.stringify({ ok: false, errors, reportPath }, null, 2));
  process.exit(1);
}

writeFileSync(outputPath, `${JSON.stringify([...importedPackages, ...preservedPackages], null, 2)}\n`);
console.log(JSON.stringify({
  ok: true,
  outputPath,
  reportPath,
  importedPackages: report.totals.packages,
  importedQuestions: report.totals.questions,
  preservedPackages: preservedPackages.length,
  packages: report.totals.packages + preservedPackages.length,
  questions: report.totals.questions + preservedPackages.reduce((total, questionPackage) => total + questionPackage.questions.length, 0),
  sources: report.sources.map((source) => ({
    fileName: basename(source.fileName),
    packages: source.parsedPackages,
    questions: source.parsedQuestions
  }))
}, null, 2));
