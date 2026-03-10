"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { EXAMS } from "@/lib/permis/exams";
import { evaluateExam } from "@/lib/permis/evaluate";
import { getQuestionById, QUESTION_BANK } from "@/lib/permis/questionBank";
import { QuestionIllustrationView } from "@/components/permis/QuestionIllustration";
import type { EvaluationResult, UserAnswers } from "@/lib/permis/types";
import { getStoredSession } from "@/lib/supabase/auth";
import { PLAN_CONFIG, type PlanCode } from "@/lib/saas/plans";

const EXAM_DURATION_SECONDS = 25 * 60;
const FREE_EXAM_ID = 1;
const PUBLIC_FREE_EXAM_QUESTION_IDS = [
  "Q129",
  "Q130",
  "Q162",
  "Q163",
  "Q164",
  "Q165",
  "Q166",
  "Q170",
  "Q171",
  "Q172",
  "Q173",
  "Q174",
  "Q177",
  "Q178",
  "Q180",
  "Q181",
  "Q182",
  "Q183",
  "Q185",
  "Q186",
  "Q190",
  "Q191",
  "Q193",
  "Q194",
  "Q195",
] as const;

type AccessInfo = {
  userId: string;
  email?: string;
  planCode: PlanCode | null;
  planName: string;
  expiresAt: string | null;
  hasPaidAccess: boolean;
  freeTrialUsed: boolean;
  freeExamId: number;
  accessibleExamCount: number;
  strictMode: boolean;
  isGuest?: boolean;
};

type SectionScore = {
  section: string;
  correct: number;
  total: number;
  score: number;
};

async function parseApiJson<T>(response: Response): Promise<T> {
  const raw = await response.text();
  if (!raw) return {} as T;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return {} as T;
  }
}

function mapCategoryToSection(category: string): string {
  if (
    [
      "Signalisation",
      "Vitesse",
      "Zone scolaire",
      "Transport scolaire",
      "Passage a niveau",
      "Zone de travaux",
    ].includes(category)
  ) {
    return "Signalisation et regles";
  }
  if (["Priorite", "Circulation", "Depassement", "Cyclistes", "Zone partagee", "Urgence"].includes(category)) {
    return "Partage de la route";
  }
  return "Conduite securitaire";
}

function computeSectionScores(
  questions: Array<NonNullable<ReturnType<typeof getQuestionById>>>,
  answers: UserAnswers
): SectionScore[] {
  const totals = new Map<string, { total: number; correct: number }>();
  for (const question of questions) {
    const section = mapCategoryToSection(question.category);
    const current = totals.get(section) ?? { total: 0, correct: 0 };
    current.total += 1;
    if ((answers[question.id] ?? null) === question.correctOptionIndex) {
      current.correct += 1;
    }
    totals.set(section, current);
  }
  return [...totals.entries()].map(([section, row]) => ({
    section,
    total: row.total,
    correct: row.correct,
    score: Number(((row.correct / row.total) * 100).toFixed(2)),
  }));
}

function simpleExplanation(text?: string): string {
  if (!text) return "";
  const firstSentence = text.split(".")[0]?.trim();
  return firstSentence ? `${firstSentence}.` : text;
}

function buildBasicQuestionIds(baseIds: string[], examId: number): string[] {
  const targetCount = 28;
  if (baseIds.length >= targetCount) {
    return baseIds.slice(0, targetCount);
  }

  const used = new Set(baseIds);
  const extrasNeeded = targetCount - baseIds.length;
  const extras: string[] = [];
  const offset = examId % QUESTION_BANK.length;

  for (let i = 0; i < QUESTION_BANK.length && extras.length < extrasNeeded; i++) {
    const question = QUESTION_BANK[(i + offset) % QUESTION_BANK.length];
    if (!used.has(question.id)) {
      used.add(question.id);
      extras.push(question.id);
    }
  }

  return [...baseIds, ...extras];
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#15803d";
  if (score >= 60) return "#0284c7";
  if (score >= 40) return "#d97706";
  return "#dc2626";
}

function PercentageDonut({ score, size = 74 }: { score: number; size?: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  const [animatedScore, setAnimatedScore] = useState(0);
  const strokeWidth = 8;
  const innerPadding = 3;
  const radius = (size - strokeWidth - innerPadding * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const color = getScoreColor(clamped);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimatedScore(clamped));
    return () => cancelAnimationFrame(frame);
  }, [clamped]);

  return (
    <div
      className="relative shrink-0"
      style={{
        width: size,
        height: size,
      }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#cbd5e1"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 950ms cubic-bezier(0.22, 1, 0.36, 1), stroke 200ms ease-out",
          }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-800">
        {clamped.toFixed(0)}%
      </span>
    </div>
  );
}

export default function SimulationsPage() {
  const [selectedExamId, setSelectedExamId] = useState<number>(1);
  const [isExamStarted, setIsExamStarted] = useState<boolean>(false);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(EXAM_DURATION_SECONDS);
  const answersRef = useRef<UserAnswers>({});
  const [accessLoading, setAccessLoading] = useState(true);
  const [accessError, setAccessError] = useState<string | null>(null);
  const [accessInfo, setAccessInfo] = useState<AccessInfo | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectionNotice, setSelectionNotice] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanCode>("pro");
  const [sectionScores, setSectionScores] = useState<SectionScore[]>([]);
  const [resultSaveNotice, setResultSaveNotice] = useState<string | null>(null);
  const isFinishingRef = useRef(false);

  const selectedExam = useMemo(
    () => EXAMS.find((exam) => exam.exam_id === selectedExamId) ?? EXAMS[0],
    [selectedExamId]
  );

  const questions = useMemo(() => {
    const freeExamId = accessInfo?.freeExamId ?? FREE_EXAM_ID;
    const isPublicFreeExam = Boolean(
      accessInfo && !accessInfo.hasPaidAccess && selectedExam.exam_id === freeExamId
    );
    const isBasicPlan = accessInfo?.hasPaidAccess && accessInfo.planCode === "basic";
    const sourceIds = isPublicFreeExam ? [...PUBLIC_FREE_EXAM_QUESTION_IDS] : selectedExam.questions;
    const ids = isBasicPlan
      ? buildBasicQuestionIds(sourceIds, selectedExam.exam_id)
      : sourceIds;
    return ids
      .map((id) => getQuestionById(id))
      .filter((question): question is NonNullable<typeof question> => Boolean(question));
  }, [accessInfo, selectedExam]);

  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / Math.max(questions.length, 1)) * 100);
  const strictModeActive = Boolean(accessInfo?.hasPaidAccess && accessInfo.strictMode);
  const isProPlan = Boolean(accessInfo?.hasPaidAccess && accessInfo.planCode === "pro");
  const questionsById = useMemo(
    () => new Map(questions.map((question) => [question.id, question])),
    [questions]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [isExamStarted, currentIndex, result]);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const loadAccess = useCallback(async () => {
    setAccessLoading(true);
    setAccessError(null);

    const session = getStoredSession();
    if (!session?.access_token) {
      setAccessInfo({
        userId: "guest",
        planCode: null,
        planName: "ESSAI GRATUIT",
        expiresAt: null,
        hasPaidAccess: false,
        freeTrialUsed: false,
        freeExamId: FREE_EXAM_ID,
        accessibleExamCount: 1,
        strictMode: false,
        isGuest: true,
      });
      setSelectedExamId(FREE_EXAM_ID);
      setAccessLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/access", {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      const json = await parseApiJson<AccessInfo & { error?: string }>(response);
      if (!response.ok) {
        throw new Error(json.error ?? "Impossible de verifier l acces.");
      }
      setAccessInfo(json);
      if (!json.hasPaidAccess) {
        setSelectedExamId(json.freeExamId);
      } else {
        setSelectedExamId((prev) => (prev > json.accessibleExamCount ? 1 : prev));
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Impossible de verifier l acces.";
      setAccessError(message);
    } finally {
      setAccessLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAccess();
  }, [loadAccess]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const signupState = params.get("signup");
    const checkoutState = params.get("checkout");
    const sessionId = params.get("session_id");
    if (signupState === "confirmed") {
      setSelectionNotice("Inscription confirmee. Bienvenue, ton compte est maintenant actif.");
      params.delete("signup");
      const nextQuery = params.toString();
      const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}`;
      window.history.replaceState({}, "", nextUrl);
    }
    if (checkoutState === "success") {
      const session = getStoredSession();
      if (session?.access_token && sessionId) {
        void (async () => {
          try {
            const response = await fetch("/api/stripe/confirm", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({ sessionId }),
            });
            const json = await parseApiJson<{ error?: string; access?: AccessInfo }>(response);
            if (!response.ok) {
              throw new Error(json.error ?? "Paiement confirme mais acces non active.");
            }
            if (json.access) {
              setAccessInfo(json.access);
            } else {
              await loadAccess();
            }
            setSelectionNotice("Paiement confirme. Les 20 examens sont maintenant debloques.");
          } catch (error) {
            const message =
              error instanceof Error ? error.message : "Erreur de confirmation du paiement.";
            setSelectionNotice(message);
            await loadAccess();
          } finally {
            params.delete("checkout");
            params.delete("session_id");
            const nextQuery = params.toString();
            const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}`;
            window.history.replaceState({}, "", nextUrl);
          }
        })();
      } else {
        setSelectionNotice("Paiement recu. Actualise la page si l acces n est pas encore mis a jour.");
      }
    }
    if (checkoutState === "cancel") {
      setSelectionNotice("Paiement annule. Tu peux reessayer quand tu veux.");
      params.delete("checkout");
      const nextQuery = params.toString();
      const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}`;
      window.history.replaceState({}, "", nextUrl);
    }
  }, [loadAccess]);

  useEffect(() => {
    if (!isExamStarted || result || !strictModeActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setResult(evaluateExam(questions, answersRef.current));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamStarted, result, questions, strictModeActive]);

  function startExam() {
    if (!accessInfo) return;
    if (accessInfo.isGuest) {
      if (selectedExamId !== accessInfo.freeExamId) {
        setSelectionNotice(`En mode invite, seul l examen ${accessInfo.freeExamId} est accessible.`);
        return;
      }
    } else if (!accessInfo.hasPaidAccess) {
      if (selectedExamId !== accessInfo.freeExamId) {
        setSelectionNotice(`Seul l examen ${accessInfo.freeExamId} est disponible en essai gratuit.`);
        return;
      }
      if (accessInfo.freeTrialUsed) {
        setSelectionNotice("Ton essai gratuit est deja utilise. Debloque le pack complet pour continuer.");
        return;
      }
    } else if (selectedExamId > accessInfo.accessibleExamCount) {
      setSelectionNotice(
        `Ton plan ${accessInfo.planName} permet les examens 1 a ${accessInfo.accessibleExamCount}.`
      );
      return;
    }

    setAnswers({});
    setResult(null);
    setCurrentIndex(0);
    setSelectedOption(null);
    setTimeLeft(EXAM_DURATION_SECONDS);
    setSectionScores([]);
    setResultSaveNotice(null);
    setSelectionNotice(null);
    setIsExamStarted(true);
  }

  async function finishExam(finalAnswers?: UserAnswers) {
    if (isFinishingRef.current) {
      return evaluateExam(questions, finalAnswers ?? answersRef.current);
    }
    isFinishingRef.current = true;
    try {
      const final = evaluateExam(questions, finalAnswers ?? answersRef.current);
      setResult(final);
      const nextSectionScores = computeSectionScores(questions, finalAnswers ?? answersRef.current);
      setSectionScores(nextSectionScores);

      const session = getStoredSession();
      if (
        accessInfo &&
        !accessInfo.isGuest &&
        !accessInfo.hasPaidAccess &&
        selectedExamId === accessInfo.freeExamId &&
        session?.access_token
      ) {
        try {
          const consumeResponse = await fetch("/api/access", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              action: "consume_free_trial",
              examId: selectedExamId,
            }),
          });
          const consumeJson = await parseApiJson<{ access?: AccessInfo }>(consumeResponse);
          if (consumeResponse.ok && consumeJson.access) {
            setAccessInfo(consumeJson.access);
          }
        } catch {
          // Keep result flow stable even if trial flag update fails.
        }
      }

      if (session?.access_token) {
        try {
          const totalQuestions = questions.length;
          const correctAnswers = totalQuestions - final.erreurs.length;
          const saveResponse = await fetch("/api/results", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              examId: selectedExam.exam_id,
              totalQuestions,
              correctAnswers,
              scorePercent: final.score,
              passed: final.reussite,
              answers: finalAnswers ?? answersRef.current,
              errors: final.erreurs,
              sectionScores: nextSectionScores,
            }),
          });
          const saveJson = await parseApiJson<{ error?: string }>(saveResponse);
          if (!saveResponse.ok) {
            throw new Error(
              saveJson.error ??
                "Resultat non enregistre. Verifie la table user_results dans Supabase."
            );
          }
          setResultSaveNotice(null);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Erreur inconnue d enregistrement.";
          setResultSaveNotice(
            `Resultat affiche localement, mais non enregistre dans la base. ${message}`
          );
        }
      } else if (accessInfo?.isGuest) {
        setResultSaveNotice(
          "Mode essai gratuit: resultat non sauvegarde. Cree un compte pour enregistrer tes tentatives."
        );
      }

      return final;
    } finally {
      isFinishingRef.current = false;
    }
  }

  function persistCurrentSelection(baseAnswers: UserAnswers): UserAnswers {
    if (!currentQuestion) return baseAnswers;
    if (selectedOption === null) return baseAnswers;
    return { ...baseAnswers, [currentQuestion.id]: selectedOption };
  }

  function goToNextQuestion() {
    if (!currentQuestion || selectedOption === null || result) return;

    const nextAnswers = persistCurrentSelection(answersRef.current);
    answersRef.current = nextAnswers;
    setAnswers(nextAnswers);

    if (currentIndex >= questions.length - 1) {
      void finishExam(nextAnswers);
      return;
    }

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    const nextQuestionId = questions[nextIndex]?.id;
    const previousSelection =
      typeof nextQuestionId === "string" ? (nextAnswers[nextQuestionId] ?? null) : null;
    setSelectedOption(typeof previousSelection === "number" ? previousSelection : null);
  }

  function goToPreviousQuestion() {
    if (!currentQuestion || result || currentIndex <= 0 || strictModeActive) return;

    const nextAnswers = persistCurrentSelection(answersRef.current);
    answersRef.current = nextAnswers;
    setAnswers(nextAnswers);

    const previousIndex = currentIndex - 1;
    setCurrentIndex(previousIndex);
    const previousQuestionId = questions[previousIndex]?.id;
    const previousSelection =
      typeof previousQuestionId === "string" ? (nextAnswers[previousQuestionId] ?? null) : null;
    setSelectedOption(typeof previousSelection === "number" ? previousSelection : null);
  }

  function restartCurrentExam() {
    setAnswers({});
    answersRef.current = {};
    setResult(null);
    setCurrentIndex(0);
    setSelectedOption(null);
    setTimeLeft(EXAM_DURATION_SECONDS);
    setSectionScores([]);
    setResultSaveNotice(null);
  }

  async function openStripeCheckout() {
    const session = getStoredSession();
    if (!session?.access_token) {
      setSelectionNotice("Connecte-toi d abord pour acheter un plan.");
      return;
    }

    try {
      setPaymentLoading(true);
      setSelectionNotice(null);
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ plan: selectedPlan }),
      });
      const json = await parseApiJson<{ url?: string; error?: string }>(response);
      if (!response.ok || !json.url) {
        throw new Error(json.error ?? "Impossible de lancer le paiement.");
      }
      window.location.href = json.url;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Impossible de lancer le paiement.";
      setSelectionNotice(message);
    } finally {
      setPaymentLoading(false);
    }
  }

  if (!isExamStarted) {
    if (accessLoading) {
      return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
          <div className="fixed left-4 top-4 z-40">
            <Link
              href="/"
              aria-label="Retour accueil"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 10.5L12 3l9 7.5" />
                <path d="M5 9.5V21h14V9.5" />
              </svg>
            </Link>
          </div>
          <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-10 sm:px-10">
            <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
              <p className="text-sm text-slate-600">Verification de ton acces...</p>
            </section>
          </main>
        </div>
      );
    }

    if (accessError || !accessInfo) {
      return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
          <div className="fixed left-4 top-4 z-40">
            <Link
              href="/"
              aria-label="Retour accueil"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 10.5L12 3l9 7.5" />
                <path d="M5 9.5V21h14V9.5" />
              </svg>
            </Link>
          </div>
          <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-10 sm:px-10">
            <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
              <h1 className="font-display text-2xl font-semibold tracking-tight">Acces requis</h1>
              <p className="mt-2 text-sm text-slate-600">
                {accessError ?? "Connecte-toi pour acceder aux simulations."}
              </p>
              <div className="mt-5 flex gap-3">
                <Link
                  href="/connexion"
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Connexion
                </Link>
                <Link
                  href="/inscription"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Inscription
                </Link>
              </div>
            </section>
          </main>
        </div>
      );
    }

    const freeExamId = accessInfo.freeExamId || FREE_EXAM_ID;
    const freeLocked = !accessInfo.hasPaidAccess && accessInfo.freeTrialUsed;

    return (
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <div className="fixed left-4 top-4 z-40">
          <Link
            href="/"
            aria-label="Retour accueil"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 10.5L12 3l9 7.5" />
              <path d="M5 9.5V21h14V9.5" />
            </svg>
          </Link>
        </div>
        <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-10 sm:px-10">
          <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">Simulations</p>
            <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight">
              Examen Theorique SAAQ
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              Choisissez un examen. Le test se lance en plein ecran.
            </p>

            <div className="mt-6 grid gap-4">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Examen
                <select
                  value={selectedExam.exam_id}
                  onChange={(event) => setSelectedExamId(Number(event.target.value))}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  {EXAMS.map((exam) => (
                    <option
                      key={exam.exam_id}
                      value={exam.exam_id}
                      disabled={
                        (!accessInfo.hasPaidAccess && exam.exam_id !== freeExamId) ||
                        (accessInfo.hasPaidAccess && exam.exam_id > accessInfo.accessibleExamCount)
                      }
                    >
                      Examen {exam.exam_id}
                      {!accessInfo.hasPaidAccess && exam.exam_id !== freeExamId
                        ? " (pack)"
                        : accessInfo.hasPaidAccess && exam.exam_id > accessInfo.accessibleExamCount
                          ? " (non inclus)"
                          : ""}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                {accessInfo.hasPaidAccess ? (
                  <p>
                    Plan actif: {accessInfo.planName} ({accessInfo.accessibleExamCount} examens)
                    {accessInfo.expiresAt
                      ? ` - expire le ${new Date(accessInfo.expiresAt).toLocaleDateString("fr-CA")}`
                      : ""}
                    {accessInfo.strictMode ? " - mode strict actif" : " - mode entrainement"}
                  </p>
                ) : accessInfo.isGuest ? (
                  <p>
                    Essai gratuit public: Examen {freeExamId} accessible sans inscription (questions
                    les plus frequentes). Cree un compte pour sauvegarder tes resultats.
                  </p>
                ) : accessInfo.freeTrialUsed ? (
                  <p>
                    Essai gratuit utilise. Debloque le pack pour acceder aux 20 examens.
                  </p>
                ) : (
                  <p>
                    Essai gratuit actif: tu peux passer 1 examen gratuit (Examen {freeExamId}).
                  </p>
                )}
              </div>

              {selectionNotice ? (
                <p className="rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-800">
                  {selectionNotice}
                </p>
              ) : null}

              <button
                onClick={startExam}
                disabled={freeLocked}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Commencer l examen
              </button>

              {!accessInfo.hasPaidAccess ? (
                accessInfo.isGuest ? (
                  <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    <p>Passe en compte membre pour acheter un plan et debloquer tous les examens.</p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href="/connexion"
                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        Connexion
                      </Link>
                      <Link
                        href="/inscription"
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Inscription
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                      Plan
                      <select
                        value={selectedPlan}
                        onChange={(event) => setSelectedPlan(event.target.value as PlanCode)}
                        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                      >
                        <option value="basic">
                          BASIC - {PLAN_CONFIG.basic.priceLabel} - 10 jours / 10 examens
                        </option>
                        <option value="pro">
                          PRO - {PLAN_CONFIG.pro.priceLabel} - 30 jours / 20 examens
                        </option>
                      </select>
                    </label>
                    <button
                      onClick={openStripeCheckout}
                      disabled={paymentLoading}
                      className="rounded-xl border border-teal-600 bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {paymentLoading
                        ? "Redirection Stripe..."
                        : `Debloquer plan ${selectedPlan.toUpperCase()} - ${
                            selectedPlan === "basic"
                              ? PLAN_CONFIG.basic.priceLabel
                              : PLAN_CONFIG.pro.priceLabel
                          }`}
                    </button>
                  </div>
                )
              ) : null}
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef1f4] text-slate-900">
      <div className="fixed left-4 top-4 z-40">
        <Link
          href="/"
          aria-label="Retour accueil"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 10.5L12 3l9 7.5" />
            <path d="M5 9.5V21h14V9.5" />
          </svg>
        </Link>
      </div>
      {!result && currentQuestion ? (
        <main className="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-4 py-4 sm:px-6">
          <header className="mb-4 flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">
                Examen {selectedExam.exam_id}
              </p>
              <h1 className="font-display mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
                Question {currentIndex + 1} / {questions.length}
              </h1>
              <div className="mt-3 h-2 w-56 overflow-hidden rounded-full bg-slate-200 sm:w-72">
                <div
                  className="h-full bg-teal-600 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
              {strictModeActive ? (
                <>
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Temps restant</p>
                  <p className={`mt-1 text-2xl font-bold ${timeLeft <= 120 ? "text-red-600" : "text-slate-900"}`}>
                    {formatTime(timeLeft)}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Mode</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">Entrainement</p>
                </>
              )}
            </div>
          </header>

          <article className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)] sm:p-6">
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              {!strictModeActive ? (
                <>
                  <span className="rounded-full bg-slate-100 px-2 py-1">{currentQuestion.id}</span>
                  <span className="rounded-full bg-teal-50 px-2 py-1 text-teal-700">{currentQuestion.category}</span>
                  <span className="rounded-full bg-amber-50 px-2 py-1 text-amber-700">
                    {currentQuestion.difficulty}
                  </span>
                </>
              ) : (
                <span className="rounded-full bg-slate-100 px-2 py-1">Mode strict</span>
              )}
            </div>

            <h2 className="text-xl leading-tight sm:text-4xl">{currentQuestion.question}</h2>

            <div className={`mt-5 grid gap-4 ${currentQuestion.illustration ? "lg:grid-cols-2" : ""}`}>
              {currentQuestion.illustration ? (
                <QuestionIllustrationView illustration={currentQuestion.illustration} revealSolution={false} />
              ) : null}

              <div className="grid gap-3">
                {currentQuestion.options.map((option, optionIndex) => {
                  const checked = selectedOption === optionIndex;
                  const letters = ["A", "B", "C", "D"];
                  return (
                    <button
                      type="button"
                      key={`${currentQuestion.id}-${optionIndex}`}
                      onClick={() => setSelectedOption(optionIndex)}
                      className={`flex rounded-xl border shadow-sm transition ${
                        checked
                          ? "border-slate-900 bg-slate-100"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <span className="flex w-14 shrink-0 items-center justify-center bg-[#d8dccf] text-2xl font-medium text-slate-700 md:w-16 md:text-3xl">
                        {letters[optionIndex]}
                      </span>
                      <span className="flex min-h-20 flex-1 items-center px-4 py-4 text-lg leading-tight text-slate-700 md:min-h-24 md:px-5 md:text-[1.9rem]">
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </article>

          <footer className="mt-4 flex justify-between gap-3">
            <div className="flex gap-3">
              {!strictModeActive ? (
                <>
                  <button
                    onClick={goToPreviousQuestion}
                    disabled={currentIndex === 0}
                    className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Precedent
                  </button>
                  <button
                    onClick={() => void finishExam()}
                    className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Terminer maintenant
                  </button>
                </>
              ) : null}
            </div>
            <button
              onClick={goToNextQuestion}
              disabled={selectedOption === null}
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {currentIndex >= questions.length - 1 ? "Terminer" : "Suivant"}
            </button>
          </footer>
        </main>
      ) : null}

      {result ? (
        <main className="mx-auto flex min-h-screen w-full max-w-[1700px] items-start px-4 py-6 sm:px-8">
          <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Resultat final</h2>
                <p className="mt-3 text-xl font-semibold">
                  Score: {result.score}% - {result.reussite ? "Reussite" : "Echec"}
                </p>
                <p className="mt-1 text-sm text-slate-600">Seuil de reussite: 80%</p>
              </div>
              <PercentageDonut score={result.score} size={92} />
            </div>
            {isProPlan && sectionScores.length > 0 ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">Score par section</p>
                <div className="mt-2 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {sectionScores.map((section) => (
                    <div
                      key={section.section}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">{section.section}</p>
                        <p className="mt-1 text-xl font-semibold text-slate-900">{section.score}%</p>
                        <p className="text-xs text-slate-500">
                          {section.correct}/{section.total}
                        </p>
                      </div>
                      <PercentageDonut score={section.score} />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {resultSaveNotice ? (
              <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                {resultSaveNotice}
              </p>
            ) : null}

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">
                {isProPlan ? "Analyse detaillee des erreurs" : "Erreurs"} ({result.erreurs.length})
              </p>
              {result.erreurs.length === 0 ? (
                <p className="mt-2 text-sm text-emerald-700">Aucune erreur detectee.</p>
              ) : (
                <div className="mt-3 space-y-3">
                  {result.erreurs.map((error, index) => {
                    const question = questionsById.get(error.questionId);
                    const userAnswerText =
                      error.reponseUtilisateur === null || !question
                        ? "Non repondu"
                        : question.options[error.reponseUtilisateur];
                    const correctAnswerText = question
                      ? question.options[error.reponseCorrecte]
                      : `Option ${error.reponseCorrecte + 1}`;

                    return (
                      <article
                        key={error.questionId}
                        className="rounded-xl border border-slate-200 bg-white p-3"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Erreur {index + 1} - {error.questionId}
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-900">
                          {question?.question ?? "Question introuvable"}
                        </p>

                        {question?.illustration ? (
                          <div className="mt-3">
                            <QuestionIllustrationView
                              illustration={question.illustration}
                              revealSolution={true}
                            />
                          </div>
                        ) : null}

                        {isProPlan && question ? (
                          <div className="mt-3 grid gap-2">
                            {question.options.map((option, optionIndex) => {
                              const letters = ["A", "B", "C", "D"];
                              const isCorrect = optionIndex === error.reponseCorrecte;
                              const isUser = optionIndex === error.reponseUtilisateur;
                              const stateClass = isCorrect
                                ? "border-emerald-300 bg-emerald-50"
                                : isUser
                                  ? "border-red-300 bg-red-50"
                                  : "border-slate-200 bg-white";

                              return (
                                <div
                                  key={`${error.questionId}-review-${optionIndex}`}
                                  className={`flex rounded-lg border ${stateClass}`}
                                >
                                  <span className="flex w-10 shrink-0 items-center justify-center bg-[#d8dccf] text-sm font-semibold text-slate-700">
                                    {letters[optionIndex]}
                                  </span>
                                  <span className="px-3 py-2 text-sm text-slate-700">{option}</span>
                                </div>
                              );
                            })}
                          </div>
                        ) : null}

                        <p className="mt-2 text-sm text-red-700">Votre reponse: {userAnswerText}</p>
                        <p className="mt-1 text-sm text-emerald-700">Bonne reponse: {correctAnswerText}</p>
                        {question?.explanation ? (
                          <p className="mt-2 text-xs text-slate-600">
                            Explication: {isProPlan ? question.explanation : simpleExplanation(question.explanation)}
                          </p>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={restartCurrentExam}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Recommencer
              </button>
              <button
                onClick={() => {
                  setIsExamStarted(false);
                  setResult(null);
                }}
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Retour selection
              </button>
            </div>
          </section>
        </main>
      ) : null}
    </div>
  );
}
