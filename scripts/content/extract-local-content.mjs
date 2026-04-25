import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";

const repoRoot = process.cwd();
const questionRoot = "/Users/persiapantubel/Downloads/Persiapan U-Kom/Soal-Belum-Ada-Jawaban";
const materialRoot = "/Users/persiapantubel/Downloads/Persiapan U-Kom/Materi";
const outputRoot = join(repoRoot, ".local-content-cache");

const categoryByQuestionFile = [
  [/^bm/i, "bea-meterai"],
  [/^internalisasi/i, "internalisasi-kepatuhan"],
  [/^kepegawaian/i, "kepegawaian"],
  [/^keuangan/i, "kepegawaian"],
  [/^kup/i, "kup"],
  [/^organisasi/i, "organisasi"],
  [/^pbb/i, "pbb"],
  [/^pph/i, "pph"],
  [/^ppn/i, "ppn"],
  [/^tdn/i, "tata-naskah-dinas"],
  [/^tik/i, "tik"]
];

function listPdfFiles(root) {
  return readdirSync(root, { withFileTypes: true })
    .flatMap((entry) => {
      const path = join(root, entry.name);
      if (entry.isDirectory()) {
        return listPdfFiles(path);
      }

      return entry.isFile() && /\.pdf$/i.test(entry.name) ? [path] : [];
    })
    .sort((left, right) => left.localeCompare(right));
}

function getPdfText(path) {
  return execFileSync("pdftotext", ["-layout", path, "-"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
}

function getPdfInfo(path) {
  const raw = execFileSync("pdfinfo", [path], { encoding: "utf8" });
  const pages = Number(raw.match(/^Pages:\s+(\d+)/m)?.[1] ?? 0);
  const title = raw.match(/^Title:\s+(.+)$/m)?.[1]?.trim() || basename(path);

  return { pages, title };
}

function normalizeSpaces(value) {
  return value.replace(/\u00a0/g, " ").replace(/\u00ad/g, "").replace(/\s+/g, " ").trim();
}

function normalizeExtractedLine(line) {
  return normalizeSpaces(line.replace(/\f/g, "").replace(/[‐‑‒–—]/g, "-").replace(/\s\*$/, ""));
}

function isNoiseLine(line) {
  if (!line) {
    return false;
  }

  return (
    /^https?:\/\/forms\.office\.com\//i.test(line) ||
    /^When you submit this form/i.test(line) ||
    /^unless you provide it yourself/i.test(line) ||
    /^Never give out your password\. Report abuse$/i.test(line) ||
    /^This content is created by the owner of the form/i.test(line) ||
    /^the privacy or security practices of its customers/i.test(line) ||
    /^privacy or security practices of its customers/i.test(line) ||
    /^not responsible for the privacy or security practices/i.test(line) ||
    /^including those of this form owner/i.test(line) ||
    /^out your password\. Microsoft Forms/i.test(line) ||
    /^out your password\.?$/i.test(line) ||
    /^Microsoft Forms \|/i.test(line) ||
    /^AI-Powered surveys, quizzes and polls/i.test(line) ||
    /^Create my own form Privacy and cookies/i.test(line) ||
    /^Health Privacy \| Terms of use$/i.test(line) ||
    /Privacy and cookies \| Consumer Health Privacy \| Terms of use/i.test(line) ||
    /^\* Required$/i.test(line) ||
    /^\d{1,2}\/\d{1,2}\/\d{2},/.test(line) ||
    /^Page \d+/i.test(line)
  );
}

function cleanTextLines(text) {
  return text
    .split(/\r?\n/)
    .map(normalizeExtractedLine)
    .map((line) => (isNoiseLine(line) ? "" : line));
}

function splitBlocks(lines) {
  const blocks = [];
  let current = [];

  for (const line of lines) {
    if (!line) {
      if (current.length > 0) {
        blocks.push(normalizeSpaces(current.join(" ")));
        current = [];
      }
      continue;
    }

    current.push(line);
  }

  if (current.length > 0) {
    blocks.push(normalizeSpaces(current.join(" ")));
  }

  return blocks;
}

function getCategoryIdFromQuestionPath(path) {
  const fileName = basename(path);
  const match = categoryByQuestionFile.find(([pattern]) => pattern.test(fileName));

  return match?.[1] ?? "unknown";
}

function isQuestionStartBlock(block, expectedOrdinal) {
  return block === String(expectedOrdinal) || block.startsWith(`${expectedOrdinal}. `);
}

function stripOrdinal(block, ordinal) {
  if (block === String(ordinal)) {
    return "";
  }

  return block.replace(new RegExp(`^${ordinal}\\.\\s*`), "").replace(new RegExp(`^${ordinal}\\s+`), "").trim();
}

function parseQuestionPdf(path) {
  const text = getPdfText(path);
  const lines = cleanTextLines(text);
  const blocks = splitBlocks(lines).filter((block) => {
    return !/^When you submit this form/i.test(block) && !/^unless you provide it yourself/i.test(block);
  });
  const questions = [];
  let ordinal = 1;
  let cursor = blocks.findIndex((block) => isQuestionStartBlock(block, ordinal));

  while (cursor >= 0 && cursor < blocks.length) {
    const nextOrdinal = ordinal + 1;
    const nextStart = blocks.findIndex((block, index) => index > cursor && isQuestionStartBlock(block, nextOrdinal));
    const segment = blocks.slice(cursor, nextStart === -1 ? blocks.length : nextStart);
    const segmentBlocks = [...segment];
    const firstBlock = stripOrdinal(segmentBlocks.shift() ?? "", ordinal);
    const contentBlocks = firstBlock ? [firstBlock, ...segmentBlocks] : segmentBlocks;

    if (contentBlocks.length >= 5) {
      const options = contentBlocks.slice(-4).map((option) => option.replace(/\s\*$/, "").trim());
      const question = contentBlocks.slice(0, -4).join(" ").replace(/\s\*$/, "").trim();

      questions.push({
        ordinal,
        categoryId: getCategoryIdFromQuestionPath(path),
        sourcePath: path,
        sourceTitle: basename(path),
        question,
        options
      });
    } else {
      questions.push({
        ordinal,
        categoryId: getCategoryIdFromQuestionPath(path),
        sourcePath: path,
        sourceTitle: basename(path),
        question: contentBlocks.join(" "),
        options: [],
        parseWarning: `Expected at least 5 content blocks, got ${contentBlocks.length}.`
      });
    }

    ordinal = nextOrdinal;
    cursor = nextStart;
  }

  return questions;
}

function inferMaterialCategory(path) {
  const relativePath = relative(materialRoot, dirname(path)).toLowerCase();
  const fileName = basename(path).toLowerCase();

  if (relativePath.includes("bea meterai")) return "bea-meterai";
  if (relativePath.includes("internalisasi")) return "internalisasi-kepatuhan";
  if (relativePath.includes("kepegawaian")) return "kepegawaian";
  if (relativePath.includes("ketentuan umum")) return "kup";
  if (relativePath.includes("nilai-nilai")) return "nilai-kemenkeu";
  if (relativePath.includes("organisasi")) return "organisasi";
  if (relativePath.includes("bumi dan bangunan")) return "pbb";
  if (relativePath.includes("penghasilan")) return "pph";
  if (relativePath.includes("pertambahan nilai")) return "ppn";
  if (relativePath.includes("level 2") || fileName.includes("account representative") || fileName.includes(" ar")) {
    return "account-representative";
  }
  if (relativePath.includes("level 3") || fileName.includes("penelaah") || fileName.includes(" pk")) {
    return "penelaah-keberatan";
  }
  if (relativePath.includes("tata naskah")) return "tata-naskah-dinas";
  if (relativePath.includes("teknologi informasi")) return "tik";

  return "unknown";
}

function collectInventory(paths, categoryResolver) {
  return paths.map((path) => {
    const info = getPdfInfo(path);
    const text = getPdfText(path);

    return {
      path,
      title: info.title,
      fileName: basename(path),
      pages: info.pages,
      categoryId: categoryResolver(path),
      textCharacters: text.length
    };
  });
}

mkdirSync(outputRoot, { recursive: true });

const questionPdfs = listPdfFiles(questionRoot);
const materialPdfs = listPdfFiles(materialRoot);
const questionInventory = collectInventory(questionPdfs, getCategoryIdFromQuestionPath);
const materialInventory = collectInventory(materialPdfs, inferMaterialCategory);
const extractedQuestions = questionPdfs.flatMap(parseQuestionPdf);

writeFileSync(join(outputRoot, "question-pdfs.json"), `${JSON.stringify(questionInventory, null, 2)}\n`);
writeFileSync(join(outputRoot, "material-pdfs.json"), `${JSON.stringify(materialInventory, null, 2)}\n`);
writeFileSync(join(outputRoot, "extracted-questions.json"), `${JSON.stringify(extractedQuestions, null, 2)}\n`);

const summary = {
  questionPdfCount: questionInventory.length,
  materialPdfCount: materialInventory.length,
  extractedQuestionCount: extractedQuestions.length,
  questionsByCategory: Object.fromEntries(
    Object.entries(
      extractedQuestions.reduce((counts, question) => {
        counts[question.categoryId] = (counts[question.categoryId] ?? 0) + 1;
        return counts;
      }, {})
    ).sort(([left], [right]) => left.localeCompare(right))
  ),
  parseWarnings: extractedQuestions.filter((question) => question.parseWarning || question.options.length !== 4)
};

writeFileSync(join(outputRoot, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
