import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const repoRoot = process.cwd();
const cacheRoot = join(repoRoot, ".local-content-cache");

const stopWords = new Set([
  "yang", "dan", "atau", "dalam", "dari", "pada", "dengan", "untuk", "adalah", "merupakan", "sebagai",
  "berikut", "ini", "atas", "oleh", "di", "ke", "dapat", "secara", "salah", "benar", "kecuali", "bukan",
  "manakah", "berapa", "apa", "sebutkan", "berdasarkan", "terkait", "sesuai", "ketentuan", "tanggal",
  "tahun", "nomor", "pasal", "ayat", "peraturan", "undang", "undang-undang", "pajak", "wajib", "orang"
]);
const negativePattern = /\b(kecuali|bukan|tidak termasuk|tidak mencakup|yang tidak|tidak benar|salah)\b/i;
const allCorrectPattern = /^(semua benar|semua jawaban benar|a dan b benar|pilihan a dan b benar)$/i;
const weakOptionPattern = /^(a dan b salah|pilihan a dan b salah|semua benar|semua jawaban benar|semua jawaban salah|tidak ada jawaban yang benar)$/i;

function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[‐‑‒–—]/g, "-")
    .replace(/[“”]/g, "\"")
    .replace(/[’]/g, "'")
    .replace(/[^a-z0-9%/.,()-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value) {
  return normalize(value)
    .split(/\s+/)
    .filter((token) => token.length >= 4 && !stopWords.has(token));
}

function getPdfPages(path) {
  const raw = execFileSync("pdftotext", ["-layout", path, "-"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  return raw.split("\f").map((text, index) => {
    return {
      page: index + 1,
      text,
      normalizedText: normalize(text)
    };
  });
}

function optionHit(option, page) {
  const normalizedOption = normalize(option);
  if (normalizedOption.length < 3 || weakOptionPattern.test(normalizedOption)) {
    return false;
  }

  if (page.normalizedText.includes(normalizedOption)) {
    return true;
  }

  const optionTokens = tokens(option);
  if (optionTokens.length === 0) {
    return false;
  }

  const hitCount = optionTokens.filter((token) => page.normalizedText.includes(token)).length;
  return optionTokens.length <= 2
    ? hitCount === optionTokens.length
    : hitCount / optionTokens.length >= 0.8;
}

function snippetFor(page, questionTokens, optionTokens) {
  const plain = page.text.replace(/\s+/g, " ").trim();
  const allTokens = [...questionTokens, ...optionTokens].filter(Boolean);
  const firstHit = allTokens
    .map((token) => plain.toLowerCase().indexOf(token.toLowerCase()))
    .filter((index) => index >= 0)
    .sort((left, right) => left - right)[0] ?? 0;
  const start = Math.max(0, firstHit - 160);
  return plain.slice(start, start + 520);
}

const summary = JSON.parse(readFileSync(join(cacheRoot, "final-content-summary.json"), "utf8"));
const extractedQuestions = JSON.parse(readFileSync(join(cacheRoot, "extracted-questions.json"), "utf8"));
const materialInventory = JSON.parse(readFileSync(join(cacheRoot, "material-pdfs.json"), "utf8"));
const extractedByKey = new Map(extractedQuestions.map((question) => [`${question.sourceTitle}#${question.ordinal}`, question]));
const materialByCategory = new Map();

for (const material of materialInventory) {
  if (!materialByCategory.has(material.categoryId)) {
    materialByCategory.set(material.categoryId, []);
  }
  materialByCategory.get(material.categoryId).push({
    ...material,
    pages: getPdfPages(material.path)
  });
}

const suggestions = summary.unresolvedQuestions.map((summaryQuestion) => {
  const question = {
    ...summaryQuestion,
    ...extractedByKey.get(`${summaryQuestion.sourceTitle}#${summaryQuestion.ordinal}`)
  };
  const categoryMaterials = materialByCategory.get(question.categoryId) ?? [];
  const queryTokens = tokens(question.question);
  const pages = categoryMaterials.flatMap((material) => {
    return material.pages.map((page) => {
      const questionScore = queryTokens.filter((token) => page.normalizedText.includes(token)).length;
      const optionHits = question.options.map((option, optionIndex) => {
        const hit = optionHit(option, page);
        return {
          optionIndex,
          option,
          hit
        };
      });
      const optionHitCount = optionHits.filter((option) => option.hit).length;

      return {
        materialTitle: material.fileName,
        materialPath: material.path,
        page: page.page,
        questionScore,
        optionHitCount,
        optionHits,
        score: questionScore * 3 + optionHitCount * 5,
        snippet: snippetFor(page, queryTokens, question.options.flatMap(tokens))
      };
    });
  }).sort((left, right) => right.score - left.score).slice(0, 5);

  const bestPage = pages[0];
  const isNegative = negativePattern.test(question.question);
  const optionHitIndexes = bestPage?.optionHits.filter((option) => option.hit).map((option) => option.optionIndex) ?? [];
  let suggestedOptionIndex = null;
  let reason = "manual-review";

  if (bestPage && isNegative && optionHitIndexes.length === 3) {
    suggestedOptionIndex = [0, 1, 2, 3].find((index) => !optionHitIndexes.includes(index));
    reason = "negative-question-three-options-supported";
  } else if (bestPage && !isNegative && optionHitIndexes.length === 1 && bestPage.questionScore >= 2) {
    suggestedOptionIndex = optionHitIndexes[0];
    reason = "single-option-on-relevant-page";
  } else if (bestPage && question.options.some((option) => allCorrectPattern.test(normalize(option))) && optionHitIndexes.length >= 3) {
    suggestedOptionIndex = question.options.findIndex((option) => allCorrectPattern.test(normalize(option)));
    reason = "all-correct-option-with-multiple-supported-options";
  }

  return {
    ...question,
    suggestedOptionIndex,
    suggestedAnswer: suggestedOptionIndex === null ? null : question.options[suggestedOptionIndex],
    reason,
    bestPages: pages
  };
});

writeFileSync(join(cacheRoot, "unresolved-answer-suggestions.json"), `${JSON.stringify(suggestions, null, 2)}\n`);

const highConfidence = suggestions.filter((suggestion) => suggestion.suggestedOptionIndex !== null);
console.log(JSON.stringify({
  unresolved: suggestions.length,
  highConfidence: highConfidence.length,
  highConfidenceByCategory: highConfidence.reduce((counts, suggestion) => {
    counts[suggestion.categoryId] = (counts[suggestion.categoryId] ?? 0) + 1;
    return counts;
  }, {}),
  sample: highConfidence.slice(0, 15).map((suggestion) => ({
    categoryId: suggestion.categoryId,
    sourceTitle: suggestion.sourceTitle,
    ordinal: suggestion.ordinal,
    answer: suggestion.suggestedAnswer,
    reason: suggestion.reason,
    source: `${basename(suggestion.bestPages[0].materialPath)} p.${suggestion.bestPages[0].page}`
  }))
}, null, 2));
