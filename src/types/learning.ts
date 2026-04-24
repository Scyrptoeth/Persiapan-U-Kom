export type CategoryId = "ppn";

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
  correctOptionIndex: 0 | 1 | 2 | 3;
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
