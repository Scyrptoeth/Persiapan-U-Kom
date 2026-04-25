"use client";

import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ClipboardCheck,
  Home,
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
import type { CategoryId, LearningQuestion, StoredAnswer, StudyPackage, TestAttempt } from "@/types/learning";

type Mode = "home" | "flipcard" | "test";
type ChartScenario = "best-score" | "completion";

const optionLabels = ["A", "B", "C", "D"];
const chartSize = 400;
const chartCenter = chartSize / 2;
const chartRadius = 122;
const labelRadius = 170;
const chartLevels = [20, 40, 60, 80, 100];

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

function getCategoryDisplayName(category: (typeof studyCategories)[number]) {
  if (category.id === "account-representative") {
    return "Materi Level 1";
  }

  if (category.id === "penelaah-keberatan") {
    return "Materi Level 2";
  }

  return category.shortName;
}

function getChartPoint(index: number, total: number, radius: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;

  return {
    x: chartCenter + Math.cos(angle) * radius,
    y: chartCenter + Math.sin(angle) * radius
  };
}

function formatPoints(points: Array<{ x: number; y: number }>) {
  return points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
}

export function PersiapanUkomApp() {
  const [mode, setMode] = useState<Mode>("home");
  const [chartScenario, setChartScenario] = useState<ChartScenario>("best-score");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId>(studyPackages[0]?.categoryId ?? studyCategories[0].id);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [answers, setAnswers] = useState<StoredAnswer[]>([]);
  const [submittedAttempt, setSubmittedAttempt] = useState<TestAttempt | null>(null);
  const attemptStoreSnapshot = useSyncExternalStore(
    subscribeToAttemptStore,
    getAttemptStoreSnapshot,
    getServerAttemptStoreSnapshot
  );

  const currentPackage = useMemo(() => {
    if (!selectedPackageId) {
      return null;
    }

    return studyPackages.find((studyPackage) => studyPackage.id === selectedPackageId) ?? null;
  }, [selectedPackageId]);

  const attemptStore = useMemo(() => parseAttemptStore(attemptStoreSnapshot), [attemptStoreSnapshot]);
  const currentCategory = studyCategories.find((category) => category.id === selectedCategoryId) ?? studyCategories[0];
  const visiblePackages = useMemo(() => {
    return studyPackages.filter((studyPackage) => studyPackage.categoryId === selectedCategoryId);
  }, [selectedCategoryId]);
  const currentQuestion = currentPackage?.questions[cardIndex] ?? null;
  const packageAttempts = currentPackage ? attemptStore[currentPackage.id] ?? [] : [];
  const answerMap = getAnswerMap(answers);
  const answeredCount = answers.filter((answer) => answer.selectedOptionIndex !== null).length;
  const answeredNumbers = answers.flatMap((answer, index) => (answer.selectedOptionIndex !== null ? [index + 1] : []));
  const unansweredNumbers = answers.flatMap((answer, index) => (answer.selectedOptionIndex === null ? [index + 1] : []));
  const latestAttempt = packageAttempts.at(-1);
  const chartData = useMemo(() => {
    return studyCategories.map((category) => {
      const categoryPackages = studyPackages.filter((studyPackage) => studyPackage.categoryId === category.id);
      const attemptedPackages = categoryPackages.filter((studyPackage) => (attemptStore[studyPackage.id] ?? []).length > 0);
      const bestScore = categoryPackages.reduce((best, studyPackage) => {
        const attempts = attemptStore[studyPackage.id] ?? [];
        const packageBest = attempts.reduce((currentBest, attempt) => Math.max(currentBest, attempt.percentage), 0);

        return Math.max(best, packageBest);
      }, 0);
      const completion = categoryPackages.length > 0 ? Math.round((attemptedPackages.length / categoryPackages.length) * 100) : 0;

      return {
        id: category.id,
        label: getCategoryDisplayName(category),
        fullName: category.name,
        packageCount: categoryPackages.length,
        attemptedCount: attemptedPackages.length,
        value: chartScenario === "best-score" ? bestScore : completion
      };
    });
  }, [attemptStore, chartScenario]);
  const chartPoints = chartData.map((item, index) => {
    return getChartPoint(index, chartData.length, chartRadius * (item.value / 100));
  });
  const chartPolygon = formatPoints(chartPoints);
  const chartAverage = chartData.length > 0
    ? Math.round(chartData.reduce((total, item) => total + item.value, 0) / chartData.length)
    : 0;
  const attemptedPackageCount = studyPackages.filter((studyPackage) => (attemptStore[studyPackage.id] ?? []).length > 0).length;
  const totalAttemptCount = studyPackages.reduce((total, studyPackage) => total + (attemptStore[studyPackage.id] ?? []).length, 0);
  const overallBestScore = studyPackages.reduce((best, studyPackage) => {
    const packageBest = (attemptStore[studyPackage.id] ?? []).reduce(
      (currentBest, attempt) => Math.max(currentBest, attempt.percentage),
      0
    );

    return Math.max(best, packageBest);
  }, 0);
  const strongestCategory = chartData.reduce<(typeof chartData)[number] | null>((strongest, item) => {
    if (!strongest || item.value > strongest.value) {
      return item;
    }

    return strongest;
  }, null);
  const chartDescription = chartScenario === "best-score"
    ? "Skor terbaik dari seluruh percobaan tes pada setiap kategori."
    : "Persentase paket yang sudah memiliki minimal satu percobaan tes pada setiap kategori.";

  function selectCategory(categoryId: CategoryId) {
    setSelectedCategoryId(categoryId);
    setSelectedPackageId(null);
    setCardIndex(0);
    setIsCardOpen(false);
    setAnswers([]);
    setSubmittedAttempt(null);
  }

  function selectPackage(packageId: string) {
    const nextPackage = studyPackages.find((studyPackage) => studyPackage.id === packageId);
    if (!nextPackage) {
      return;
    }

    setSelectedCategoryId(nextPackage.categoryId);
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
    if (!currentPackage) {
      return;
    }

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
    if (!currentPackage) {
      return;
    }

    setAnswers(createEmptyAnswers(currentPackage.questions));
    setSubmittedAttempt(null);
    setMode("test");
  }

  function moveCard(direction: -1 | 1) {
    if (!currentPackage) {
      return;
    }

    setCardIndex((currentIndex) => {
      const nextIndex = currentIndex + direction;
      return Math.min(Math.max(nextIndex, 0), currentPackage.questions.length - 1);
    });
    setIsCardOpen(false);
  }

  return (
    <>
      <a className="skip-link" href="#workspace">
        Lewati ke materi
      </a>
      <main className={`app-shell ${isSidebarExpanded ? "" : "is-sidebar-collapsed"}`}>
        <aside className="side-rail" aria-label="Navigasi belajar">
          <div className="brand-block">
            <div className="brand-mark" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div>
              <p className="eyebrow">DJP Learning Desk</p>
              <h1>Persiapan U-Kom</h1>
              <p className="brand-subtitle">Ujian Kompetensi DJP</p>
            </div>
          </div>

          <button
            aria-expanded={isSidebarExpanded}
            aria-label={isSidebarExpanded ? "Ringkas sidebar kategori" : "Perluas sidebar kategori"}
            className="sidebar-toggle"
            onClick={() => setIsSidebarExpanded((value) => !value)}
            type="button"
          >
            {isSidebarExpanded ? <ChevronLeft aria-hidden="true" size={18} /> : <ChevronRight aria-hidden="true" size={18} />}
            <span>{isSidebarExpanded ? "Ringkas" : "Perluas"}</span>
          </button>

          <nav className="topic-list" aria-label="Kategori materi">
            {studyCategories.map((category) => (
              <button
                className={`topic-button ${category.id === selectedCategoryId ? "is-active" : ""}`}
                key={category.id}
                aria-current={category.id === selectedCategoryId ? "true" : undefined}
                onClick={() => selectCategory(category.id)}
                type="button"
                title={getCategoryDisplayName(category)}
              >
                <Layers3 aria-hidden="true" size={18} />
                <span>
                  <strong>{getCategoryDisplayName(category)}</strong>
                  <small>{category.name}</small>
                </span>
              </button>
            ))}
          </nav>
        </aside>

      <section className="workspace" id="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">{mode === "home" ? "Progres Belajar" : currentCategory?.name}</p>
            <h2>{mode === "home" ? "Beranda" : currentPackage ? currentPackage.name : `Pilih Paket ${getCategoryDisplayName(currentCategory)}`}</h2>
          </div>
          <div className="mode-switch" aria-label="Mode belajar">
            <button
              aria-pressed={mode === "home"}
              className={mode === "home" ? "is-active" : ""}
              onClick={() => setMode("home")}
              type="button"
            >
              <Home aria-hidden="true" size={18} />
              Beranda
            </button>
            <button
              aria-pressed={mode === "flipcard"}
              className={mode === "flipcard" ? "is-active" : ""}
              onClick={() => setMode("flipcard")}
              type="button"
            >
              <BookOpen aria-hidden="true" size={18} />
              Flipcard
            </button>
            <button
              aria-pressed={mode === "test"}
              className={mode === "test" ? "is-active" : ""}
              onClick={() => setMode("test")}
              type="button"
            >
              <ClipboardCheck aria-hidden="true" size={18} />
              Tes
            </button>
          </div>
        </header>

        {mode === "home" ? null : (
          <section className={`package-picker ${currentPackage ? "has-selection" : ""}`} aria-label="Pilih paket soal">
            <div className="package-strip">
              {visiblePackages.map((studyPackage) => (
                <button
                  className={studyPackage.id === currentPackage?.id ? "is-active" : ""}
                  key={studyPackage.id}
                  aria-pressed={studyPackage.id === currentPackage?.id}
                  onClick={() => selectPackage(studyPackage.id)}
                  type="button"
                >
                  <span>{studyPackage.name}</span>
                  <small>{studyPackage.questions.length} soal</small>
                </button>
              ))}
            </div>
          </section>
        )}

        {mode === "home" ? (
          <section className="home-dashboard" aria-label="Beranda progres belajar">
            <div className="home-hero-card">
              <div>
                <p className="eyebrow">Snapshot lokal</p>
                <h3>Belajar per paket, pantau progres per kategori.</h3>
                <p>
                  Peta latihan mandiri untuk menjaga ritme sebelum Ujian Kompetensi.
                </p>
              </div>
              <dl className="home-kpis" aria-label="Ringkasan progres lokal">
                <div>
                  <dt>Paket dikerjakan</dt>
                  <dd>{attemptedPackageCount}/{studyPackages.length}</dd>
                </div>
                <div>
                  <dt>Skor terbaik</dt>
                  <dd>{overallBestScore}%</dd>
                </div>
                <div>
                  <dt>Percobaan</dt>
                  <dd>{totalAttemptCount}</dd>
                </div>
              </dl>
            </div>

            <div className="home-panel chart-panel">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Spider chart</p>
                  <h3>Ringkasan progres kategori</h3>
                </div>
                <div className="scenario-switch" aria-label="Skenario spider chart">
                  <button
                    aria-pressed={chartScenario === "best-score"}
                    className={chartScenario === "best-score" ? "is-active" : ""}
                    onClick={() => setChartScenario("best-score")}
                    type="button"
                  >
                    Skor terbaik
                  </button>
                  <button
                    aria-pressed={chartScenario === "completion"}
                    className={chartScenario === "completion" ? "is-active" : ""}
                    onClick={() => setChartScenario("completion")}
                    type="button"
                  >
                    Paket dikerjakan
                  </button>
                </div>
              </div>

              <div className="chart-layout">
                <figure className="spider-chart" aria-label={`${chartDescription} Rata-rata ${chartAverage} persen.`}>
                  <svg viewBox={`0 0 ${chartSize} ${chartSize}`} role="img" aria-labelledby="spider-chart-title spider-chart-desc">
                    <title id="spider-chart-title">Spider chart progres kategori</title>
                    <desc id="spider-chart-desc">{chartDescription}</desc>
                    {chartLevels.map((level) => (
                      <polygon
                        className="chart-ring"
                        key={level}
                        points={formatPoints(chartData.map((_, index) => getChartPoint(index, chartData.length, chartRadius * (level / 100))))}
                      />
                    ))}
                    {chartData.map((item, index) => {
                      const axisEnd = getChartPoint(index, chartData.length, chartRadius);
                      const labelPoint = getChartPoint(index, chartData.length, labelRadius);

                      return (
                        <g key={item.id}>
                          <line className="chart-axis" x1={chartCenter} x2={axisEnd.x} y1={chartCenter} y2={axisEnd.y} />
                          <text className="chart-label" textAnchor="middle" x={labelPoint.x} y={labelPoint.y}>
                            {item.label}
                          </text>
                        </g>
                      );
                    })}
                    <polygon className="chart-area" points={chartPolygon} />
                    <polyline className="chart-outline" points={`${chartPolygon} ${chartPoints[0]?.x.toFixed(1)},${chartPoints[0]?.y.toFixed(1)}`} />
                    {chartPoints.map((point, index) => (
                      <circle className="chart-dot" cx={point.x} cy={point.y} key={chartData[index].id} r="4" />
                    ))}
                  </svg>
                </figure>

                <div className="chart-summary">
                  <p>{chartDescription}</p>
                  <div>
                    <span>Rata-rata</span>
                    <strong>{chartAverage}%</strong>
                  </div>
                  <div>
                    <span>Tertinggi</span>
                    <strong>{strongestCategory ? `${strongestCategory.label} ${strongestCategory.value}%` : "-"}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="home-panel category-progress">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Kategori</p>
                  <h3>Detail progres</h3>
                </div>
              </div>
              <div className="category-progress-list">
                {chartData.map((item) => (
                  <button
                    className={item.id === selectedCategoryId ? "is-active" : ""}
                    key={item.id}
                    aria-label={`Buka ${item.fullName}: ${item.attemptedCount} dari ${item.packageCount} paket dikerjakan`}
                    onClick={() => {
                      selectCategory(item.id);
                      setMode("flipcard");
                    }}
                    type="button"
                  >
                    <span>
                      <strong>{item.label}</strong>
                      <small>
                        {item.attemptedCount}/{item.packageCount} paket dikerjakan
                      </small>
                    </span>
                    <b>{item.value}%</b>
                  </button>
                ))}
              </div>
            </div>
          </section>
        ) : !currentPackage || !currentQuestion ? null : mode === "flipcard" ? (
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
              aria-label={isCardOpen ? "Tampilkan pertanyaan" : "Tampilkan jawaban"}
              aria-pressed={isCardOpen}
              className={`flipcard ${isCardOpen ? "is-open" : ""}`}
              onClick={() => setIsCardOpen((value) => !value)}
              type="button"
            >
              <span className="flipcard-inner">
                <span aria-hidden={isCardOpen} className="flipcard-face flipcard-front">
                  <span className="card-kicker">Pertanyaan</span>
                  <span className="card-text">{currentQuestion.question}</span>
                </span>
                <span aria-hidden={!isCardOpen} className="flipcard-face flipcard-back">
                  <span className="card-kicker">Jawaban</span>
                  <span className="card-text">{currentQuestion.answer}</span>
                </span>
              </span>
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

              <section className="answer-map" aria-label="Status pengerjaan soal">
                <div className="answer-map-summary">
                  <div>
                    <span>Total soal</span>
                    <strong>{currentPackage.questions.length}</strong>
                  </div>
                  <div>
                    <span>Sudah dijawab</span>
                    <strong>{answeredCount}</strong>
                  </div>
                  <div>
                    <span>Belum dijawab</span>
                    <strong>{currentPackage.questions.length - answeredCount}</strong>
                  </div>
                </div>
              </section>

              <section className="answer-map-pins" aria-label="Nomor soal berdasarkan status jawaban">
                <div className="answer-map-columns">
                  <div>
                    <p>Nomor sudah dijawab</p>
                    <div className="question-chips">
                      {answeredNumbers.length > 0 ? (
                        answeredNumbers.map((number) => (
                          <a
                            aria-label={`Ke soal ${number}, sudah dijawab`}
                            className="is-answered"
                            href={`#question-${currentPackage.questions[number - 1].id}`}
                            key={number}
                          >
                            {number}
                          </a>
                        ))
                      ) : (
                        <span className="chip-empty">Belum ada</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p>Nomor belum dijawab</p>
                    <div className="question-chips">
                      {unansweredNumbers.map((number) => (
                        <a
                          aria-label={`Ke soal ${number}, belum dijawab`}
                          className="is-unanswered"
                          href={`#question-${currentPackage.questions[number - 1].id}`}
                          key={number}
                        >
                          {number}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <ol className="question-list">
                {currentPackage.questions.map((question, questionIndex) => {
                  const selectedOptionIndex = answerMap.get(question.id) ?? null;
                  const isCorrect = selectedOptionIndex === question.correctOptionIndex;
                  const isWrong = submittedAttempt && selectedOptionIndex !== null && !isCorrect;
                  const isUnanswered = submittedAttempt && selectedOptionIndex === null;

                  return (
                    <li className="question-item" id={`question-${question.id}`} key={question.id}>
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
                              aria-pressed={isSelected}
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
    </>
  );
}
