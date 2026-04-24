export type CategoryId =
  | "kup"
  | "pph"
  | "ppn"
  | "pbb"
  | "bea-meterai"
  | "tik"
  | "nilai-kemenkeu"
  | "organisasi"
  | "internalisasi-kepatuhan"
  | "kepegawaian"
  | "tata-naskah-dinas"
  | "account-representative"
  | "penelaah-keberatan";

export type CorrectOptionIndex = 0 | 1 | 2 | 3;

export type SourceRef = {
  title: string;
  url: string;
  note: string;
};

export type LearningQuestion = {
  id: string;
  categoryId: CategoryId;
  topic: string;
  question: string;
  answer: string;
  options: [string, string, string, string];
  correctOptionIndex: CorrectOptionIndex;
  explanation: string;
  source: SourceRef;
};

export type StudyCategory = {
  id: CategoryId;
  name: string;
  shortName: string;
  description: string;
};

export type StudyPackage = {
  id: string;
  categoryId: CategoryId;
  name: string;
  questions: LearningQuestion[];
};

export type StoredAnswer = {
  questionId: string;
  selectedOptionIndex: number | null;
};

export type TestAttempt = {
  id: string;
  packageId: string;
  score: number;
  total: number;
  percentage: number;
  submittedAt: string;
  answers: StoredAnswer[];
};
