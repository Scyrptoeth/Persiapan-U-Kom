"use client";

import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Layers3,
  RotateCcw,
  XCircle
} from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { studyCategories, studyPackages } from "@/data/questionBank";
import {
  createAttemptId,
  getAttemptStoreSnapshot,
  getServerAttemptStoreSnapshot,
  parseAttemptStore,
  subscribeToAttemptStore,
  writeAttemptStore
} from "@/lib/progress";
import type { LearningQuestion, StoredAnswer, StudyPackage, TestAttempt } from "@/types/learning";

type Mode = "flipcard" | "test";

const optionLabels = ["A", "B", "C", "D"];

function getAnswerMap(answers: StoredAnswer[]) {
  return new Map(answers.map((answer) => [answer.questionId, answer.selectedOptionIndex]));
}

function getPackageScore(currentPackage: StudyPackage, answers: StoredAnswer[]) {
  const answerMap = getAnswerMap(answers);
  return currentPackage.questions.reduce((score, question) => {
    return answerMap.get(question.id) === question.correctOptionIndex ? score + 1 : score;
  }, 0);
}

function createEmptyAnswers(questions: LearningQuestion[]): StoredAnswer[] {
  return questions.map((question) => ({
    questionId: question.id,
    selectedOptionIndex: null
  }));
}

export function PersiapanUkomApp() {
  const [mode, setMode] = useState<Mode>("flipcard");
  const [selectedPackageId, setSelectedPackageId] = useState(studyPackages[0]?.id ?? "");
  const [cardIndex, setCardIndex] = useState(0);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [answers, setAnswers] = useState<StoredAnswer[]>(() => createEmptyAnswers(studyPackages[0].questions));
  const [submittedAttempt, setSubmittedAttempt] = useState<TestAttempt | null>(null);
  const attemptStoreSnapshot = useSyncExternalStore(
    subscribeToAttemptStore,
    getAttemptStoreSnapshot,
    getServerAttemptStoreSnapshot
  );

  const currentPackage = useMemo(() => {
    return studyPackages.find((studyPackage) => studyPackage.id === selectedPackageId) ?? studyPackages[0];
  }, [selectedPackageId]);

  const attemptStore = useMemo(() => parseAttemptStore(attemptStoreSnapshot), [attemptStoreSnapshot]);
  const currentCategory = studyCategories.find((category) => category.id === currentPackage.categoryId);
  const currentQuestion = currentPackage.questions[cardIndex];
  const packageAttempts = attemptStore[currentPackage.id] ?? [];
  const answerMap = getAnswerMap(answers);
  const answeredCount = answers.filter((answer) => answer.selectedOptionIndex !== null).length;
  const latestAttempt = packageAttempts.at(-1);

  function selectPackage(packageId: string) {
    const nextPackage = studyPackages.find((studyPackage) => studyPackage.id === packageId);
    if (!nextPackage) {
      return;
    }

    setSelectedPackageId(packageId);
    setCardIndex(0);
    setIsCardOpen(false);
    setAnswers(createEmptyAnswers(nextPackage.questions));
    setSubmittedAttempt(null);
  }

  function selectAnswer(questionId: string, selectedOptionIndex: number) {
    if (submittedAttempt) {
      return;
    }

    setAnswers((currentAnswers) =>
      currentAnswers.map((answer) =>
        answer.questionId === questionId ? { ...answer, selectedOptionIndex } : answer
      )
    );
  }

  function submitTest() {
    const score = getPackageScore(currentPackage, answers);
    const attemptNumber = packageAttempts.length + 1;
    const attempt: TestAttempt = {
      id: createAttemptId(currentPackage.id, attemptNumber),
      packageId: currentPackage.id,
      score,
      total: currentPackage.questions.length,
      percentage: Math.round((score / currentPackage.questions.length) * 100),
      submittedAt: new Date().toISOString(),
      answers
    };
    const nextStore = {
      ...attemptStore,
      [currentPackage.id]: [...packageAttempts, attempt]
    };

    writeAttemptStore(nextStore);
    setSubmittedAttempt(attempt);
  }

  function retakeTest() {
    setAnswers(createEmptyAnswers(currentPackage.questions));
    setSubmittedAttempt(null);
    setMode("test");
  }

  function moveCard(direction: -1 | 1) {
    setCardIndex((currentIndex) => {
      const nextIndex = currentIndex + direction;
      return Math.min(Math.max(nextIndex, 0), currentPackage.questions.length - 1);
    });
    setIsCardOpen(false);
  }

  return (
    <main className="app-shell">
      <aside className="side-rail" aria-label="Navigasi belajar">
        <div className="brand-block">
          <div className="brand-mark" aria-hidden="true">
            UK
          </div>
          <div>
            <p className="eyebrow">Persiapan</p>
            <h1>U-Kom</h1>
          </div>
        </div>

        <nav className="topic-list" aria-label="Kategori materi">
          {studyCategories.map((category) => (
            <button
              className={`topic-button ${category.id === currentPackage.categoryId ? "is-active" : ""}`}
              key={category.id}
              onClick={() => {
                const firstPackage = studyPackages.find((studyPackage) => studyPackage.categoryId === category.id);
                if (firstPackage) {
                  selectPackage(firstPackage.id);
                }
              }}
              type="button"
            >
              <Layers3 aria-hidden="true" size={18} />
              <span>{category.shortName}</span>
            </button>
          ))}
        </nav>

        <div className="source-panel">
          <p className="panel-label">Sumber pilot</p>
          <p>{currentQuestion.source.title}</p>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">{currentCategory?.name}</p>
            <h2>{currentPackage.name}</h2>
          </div>
          <div className="mode-switch" role="tablist" aria-label="Mode belajar">
            <button
              aria-selected={mode === "flipcard"}
              className={mode === "flipcard" ? "is-active" : ""}
              onClick={() => setMode("flipcard")}
              role="tab"
              type="button"
            >
              <BookOpen aria-hidden="true" size={18} />
              Flipcard
            </button>
            <button
              aria-selected={mode === "test"}
              className={mode === "test" ? "is-active" : ""}
              onClick={() => setMode("test")}
              role="tab"
              type="button"
            >
              <ClipboardCheck aria-hidden="true" size={18} />
              Tes
            </button>
          </div>
        </header>

        <div className="package-strip" aria-label="Paket soal">
          {studyPackages.map((studyPackage) => (
            <button
              className={studyPackage.id === currentPackage.id ? "is-active" : ""}
              key={studyPackage.id}
              onClick={() => selectPackage(studyPackage.id)}
              type="button"
            >
              {studyPackage.name}
              <span>{studyPackage.questions.length} soal</span>
            </button>
          ))}
        </div>

        <section className="metrics-grid" aria-label="Statistik paket">
          <div className="metric">
            <span>Soal</span>
            <strong>{currentPackage.questions.length}</strong>
          </div>
          <div className="metric">
            <span>Percobaan</span>
            <strong>{packageAttempts.length}</strong>
          </div>
          <div className="metric">
            <span>Skor terakhir</span>
            <strong>{latestAttempt ? `${latestAttempt.score}/${latestAttempt.total}` : "-"}</strong>
          </div>
        </section>

        {mode === "flipcard" ? (
          <section className="study-surface" aria-label="Flipcard">
            <div className="study-header">
              <div>
                <p className="eyebrow">Flipcard {cardIndex + 1} dari {currentPackage.questions.length}</p>
                <h3>{currentQuestion.topic}</h3>
              </div>
              <div className="progress-track" aria-hidden="true">
                <span style={{ width: `${((cardIndex + 1) / currentPackage.questions.length) * 100}%` }} />
              </div>
            </div>

            <button
              aria-pressed={isCardOpen}
              className={`flipcard ${isCardOpen ? "is-open" : ""}`}
              onClick={() => setIsCardOpen((value) => !value)}
              type="button"
            >
              <span className="card-kicker">{isCardOpen ? "Jawaban" : "Pertanyaan"}</span>
              <span className="card-text">{isCardOpen ? currentQuestion.answer : currentQuestion.question}</span>
              {isCardOpen ? <span className="card-note">{currentQuestion.explanation}</span> : null}
            </button>

            <div className="action-row">
              <button disabled={cardIndex === 0} onClick={() => moveCard(-1)} type="button">
                <ArrowLeft aria-hidden="true" size={18} />
                Sebelumnya
              </button>
              <button onClick={() => setIsCardOpen((value) => !value)} type="button">
                <RotateCcw aria-hidden="true" size={18} />
                Balik kartu
              </button>
              <button
                disabled={cardIndex === currentPackage.questions.length - 1}
                onClick={() => moveCard(1)}
                type="button"
              >
                Berikutnya
                <ArrowRight aria-hidden="true" size={18} />
              </button>
            </div>
          </section>
        ) : (
          <section className="test-layout" aria-label="Tes">
            <div className="test-main">
              <div className="test-status">
                <div>
                  <p className="eyebrow">Tes tetap urut</p>
                  <h3>{answeredCount}/{currentPackage.questions.length} dijawab</h3>
                </div>
                {submittedAttempt ? (
                  <div className="score-badge">
                    <BarChart3 aria-hidden="true" size={18} />
                    {submittedAttempt.score}/{submittedAttempt.total}
                  </div>
                ) : null}
              </div>

              <ol className="question-list">
                {currentPackage.questions.map((question, questionIndex) => {
                  const selectedOptionIndex = answerMap.get(question.id) ?? null;
                  const isCorrect = selectedOptionIndex === question.correctOptionIndex;
                  const isWrong = submittedAttempt && selectedOptionIndex !== null && !isCorrect;
                  const isUnanswered = submittedAttempt && selectedOptionIndex === null;

                  return (
                    <li className="question-item" key={question.id}>
                      <div className="question-heading">
                        <span>{questionIndex + 1}</span>
                        <div>
                          <p>{question.topic}</p>
                          <h4>{question.question}</h4>
                        </div>
                      </div>

                      <div className="option-grid">
                        {question.options.map((option, optionIndex) => {
                          const isSelected = selectedOptionIndex === optionIndex;
                          const isAnswer = question.correctOptionIndex === optionIndex;
                          const optionState =
                            submittedAttempt && isAnswer
                              ? "is-correct"
                              : submittedAttempt && isSelected && !isAnswer
                                ? "is-wrong"
                                : isSelected
                                  ? "is-selected"
                                  : "";

                          return (
                            <button
                              className={`option-button ${optionState}`}
                              disabled={Boolean(submittedAttempt)}
                              key={option}
                              onClick={() => selectAnswer(question.id, optionIndex)}
                              type="button"
                            >
                              <span>{optionLabels[optionIndex]}</span>
                              {option}
                            </button>
                          );
                        })}
                      </div>

                      {submittedAttempt ? (
                        <div className={`review-box ${isCorrect ? "is-correct" : "is-review"}`}>
                          {isCorrect ? <CheckCircle2 aria-hidden="true" size={18} /> : <XCircle aria-hidden="true" size={18} />}
                          <div>
                            <strong>
                              {isCorrect ? "Benar" : isWrong ? "Jawaban belum tepat" : isUnanswered ? "Tidak dijawab" : "Review"}
                            </strong>
                            <p>Jawaban benar: {question.answer}</p>
                            <p>{question.explanation}</p>
                            <small>{question.source.note}</small>
                          </div>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ol>

              <div className="sticky-actions">
                {submittedAttempt ? (
                  <button onClick={retakeTest} type="button">
                    <RotateCcw aria-hidden="true" size={18} />
                    Kerjakan ulang
                  </button>
                ) : (
                  <button onClick={submitTest} type="button">
                    <ClipboardCheck aria-hidden="true" size={18} />
                    Submit tes
                  </button>
                )}
              </div>
            </div>

            <aside className="attempt-panel" aria-label="Riwayat percobaan">
              <p className="panel-label">Riwayat</p>
              {packageAttempts.length === 0 ? (
                <p className="empty-state">Belum ada percobaan.</p>
              ) : (
                <ol className="attempt-list">
                  {packageAttempts.map((attempt, index) => (
                    <li key={attempt.id}>
                      <span>Percobaan {index + 1}</span>
                      <strong>{attempt.score}/{attempt.total}</strong>
                      <small>{attempt.percentage}%</small>
                    </li>
                  ))}
                </ol>
              )}
            </aside>
          </section>
        )}
      </section>
    </main>
  );
}
