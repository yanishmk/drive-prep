"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getStoredSession } from "@/lib/supabase/auth";
import { QuestionIllustrationView } from "@/components/permis/QuestionIllustration";
import type { QuestionIllustration } from "@/lib/permis/types";

type AdminOverview = {
  usersCount: number;
  paidSubscriptionsCount: number;
  freeTrialsUsedCount: number;
  paymentsCount: number;
  revenueCents: number;
  latestPayments: Array<{
    id: number;
    customer_email: string | null;
    amount_cents: number | null;
    currency: string | null;
    status: string;
    paid_at: string;
  }>;
};

type AdminQuestion = {
  id: string;
  number: number;
  question: string;
  options: [string, string, string, string];
  correctOptionIndex: number;
  explanation: string;
  difficulty: "facile" | "moyenne" | "difficile";
  category: string;
  illustration: QuestionIllustration | null;
  hasIllustration: boolean;
  illustrationKind: "photo" | "intersection_4way" | null;
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

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [questionSearch, setQuestionSearch] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  const filteredQuestions = useMemo(() => {
    const q = questionSearch.trim().toLowerCase();
    if (!q) return questions;
    return questions.filter((question) => {
      return (
        question.id.toLowerCase().includes(q) ||
        question.question.toLowerCase().includes(q) ||
        question.category.toLowerCase().includes(q) ||
        question.difficulty.toLowerCase().includes(q)
      );
    });
  }, [questions, questionSearch]);

  const selectedQuestion = useMemo(() => {
    if (filteredQuestions.length === 0) return null;
    return (
      filteredQuestions.find((question) => question.id === selectedQuestionId) ??
      filteredQuestions[0]
    );
  }, [filteredQuestions, selectedQuestionId]);

  useEffect(() => {
    async function loadAdmin() {
      const session = getStoredSession();
      if (!session?.access_token) {
        setError("Session absente.");
        setLoading(false);
        return;
      }

      setError(null);
      setQuestionsError(null);

      try {
        const overviewResponse = await fetch("/api/admin/overview", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        const overviewJson = await parseApiJson<{
          error?: string;
          adminEmail?: string;
          overview?: AdminOverview;
        }>(overviewResponse);
        if (!overviewResponse.ok || !overviewJson.overview) {
          throw new Error(overviewJson.error ?? "Impossible de charger le dashboard admin.");
        }
        setAdminEmail(overviewJson.adminEmail ?? null);
        setOverview(overviewJson.overview);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Impossible de charger le dashboard admin.";
        setError(message);
        setLoading(false);
        return;
      }

      try {
        const questionsResponse = await fetch("/api/admin/questions", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        const questionsJson = await parseApiJson<{
          error?: string;
          questions?: AdminQuestion[];
        }>(questionsResponse);
        if (!questionsResponse.ok || !questionsJson.questions) {
          throw new Error(questionsJson.error ?? "Impossible de charger la banque de questions.");
        }

        setQuestions(questionsJson.questions);
        setSelectedQuestionId(questionsJson.questions[0]?.id ?? null);
        setQuestionsError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Impossible de charger la banque de questions.";
        setQuestionsError(message);
      } finally {
        setLoading(false);
      }
    }

    void loadAdmin();
  }, []);

  useEffect(() => {
    if (filteredQuestions.length === 0) return;
    const hasSelection = filteredQuestions.some((question) => question.id === selectedQuestionId);
    if (!hasSelection) {
      setSelectedQuestionId(filteredQuestions[0].id);
    }
  }, [filteredQuestions, selectedQuestionId]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">Admin</p>
            <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight">
              Dashboard Drive-Prep
            </h1>
            {adminEmail ? <p className="mt-1 text-sm text-slate-600">{adminEmail}</p> : null}
          </div>
          <Link
            href="/compte"
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Retour compte
          </Link>
        </div>

        {loading ? <p className="mt-5 text-sm text-slate-600">Chargement...</p> : null}
        {error ? (
          <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {overview ? (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Utilisateurs</p>
                <p className="mt-1 text-2xl font-semibold">{overview.usersCount}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Abonnes actifs</p>
                <p className="mt-1 text-2xl font-semibold">{overview.paidSubscriptionsCount}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Essais utilises</p>
                <p className="mt-1 text-2xl font-semibold">{overview.freeTrialsUsedCount}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Paiements</p>
                <p className="mt-1 text-2xl font-semibold">{overview.paymentsCount}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Revenu recent</p>
                <p className="mt-1 text-2xl font-semibold">{(overview.revenueCents / 100).toFixed(2)} CAD</p>
              </div>
            </div>

            <div className="mt-7 rounded-xl border border-slate-200">
              <div className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                Derniers paiements
              </div>
              <div className="max-h-[420px] overflow-auto">
                {overview.latestPayments.length === 0 ? (
                  <p className="px-4 py-4 text-sm text-slate-600">Aucun paiement.</p>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Montant</th>
                        <th className="px-4 py-2">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overview.latestPayments.map((payment) => (
                        <tr key={payment.id} className="border-t border-slate-100">
                          <td className="px-4 py-2">
                            {new Date(payment.paid_at).toLocaleString("fr-CA")}
                          </td>
                          <td className="px-4 py-2">{payment.customer_email ?? "N/A"}</td>
                          <td className="px-4 py-2">
                            {((payment.amount_cents ?? 0) / 100).toFixed(2)}{" "}
                            {(payment.currency ?? "cad").toUpperCase()}
                          </td>
                          <td className="px-4 py-2">{payment.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="mt-7 rounded-xl border border-slate-200">
              <div className="border-b border-slate-200 px-4 py-3">
                <p className="text-sm font-semibold text-slate-800">Banque de questions</p>
                <p className="mt-1 text-xs text-slate-600">
                  Acces par numerotation (Q001, Q002...) et details complets.
                </p>
              </div>

              <div className="border-b border-slate-200 px-4 py-3">
                <input
                  value={questionSearch}
                  onChange={(event) => setQuestionSearch(event.target.value)}
                  placeholder="Recherche: Q005, signalisation, difficile..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-teal-500 transition focus:ring-2"
                />
                <p className="mt-2 text-xs text-slate-500">
                  {filteredQuestions.length} resultat(s) sur {questions.length} question(s).
                </p>
              </div>

              {questionsError ? (
                <p className="mx-4 mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {questionsError}
                </p>
              ) : null}

              <div className="grid gap-0 lg:grid-cols-[300px_1fr]">
                <div className="max-h-[560px] overflow-auto border-b border-slate-200 p-3 lg:border-b-0 lg:border-r">
                  {filteredQuestions.length === 0 ? (
                    <p className="text-sm text-slate-600">Aucun resultat.</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {filteredQuestions.map((question) => {
                        const isActive = selectedQuestion?.id === question.id;
                        return (
                          <button
                            key={question.id}
                            type="button"
                            onClick={() => setSelectedQuestionId(question.id)}
                            className={`rounded-lg border px-2 py-2 text-xs font-semibold ${
                              isActive
                                ? "border-teal-600 bg-teal-50 text-teal-700"
                                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {question.id}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  {selectedQuestion ? (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border border-slate-300 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                          {selectedQuestion.id}
                        </span>
                        <span className="rounded-full border border-slate-300 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                          {selectedQuestion.category}
                        </span>
                        <span className="rounded-full border border-slate-300 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                          {selectedQuestion.difficulty}
                        </span>
                        <span className="rounded-full border border-slate-300 bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                          {selectedQuestion.hasIllustration
                            ? `illustration: ${selectedQuestion.illustrationKind ?? "oui"}`
                            : "sans illustration"}
                        </span>
                      </div>

                      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
                        <h3 className="text-xl leading-tight text-slate-900 sm:text-2xl">
                          {selectedQuestion.question}
                        </h3>

                        <div
                          className={`mt-4 grid gap-4 ${
                            selectedQuestion.illustration ? "lg:grid-cols-2" : ""
                          }`}
                        >
                          {selectedQuestion.illustration ? (
                            <QuestionIllustrationView
                              illustration={selectedQuestion.illustration}
                              revealSolution={false}
                            />
                          ) : null}

                          <div className="grid gap-3">
                            {selectedQuestion.options.map((option, optionIndex) => {
                              const letters = ["A", "B", "C", "D"];
                              const isCorrect = optionIndex === selectedQuestion.correctOptionIndex;
                              return (
                                <div
                                  key={`${selectedQuestion.id}-option-${optionIndex}`}
                                  className={`flex rounded-xl border shadow-sm ${
                                    isCorrect
                                      ? "border-emerald-300 bg-emerald-50"
                                      : "border-slate-200 bg-white"
                                  }`}
                                >
                                  <span className="flex w-14 shrink-0 items-center justify-center bg-[#d8dccf] text-2xl font-medium text-slate-700 md:w-16 md:text-3xl">
                                    {letters[optionIndex]}
                                  </span>
                                  <span className="flex min-h-20 flex-1 items-center px-4 py-4 text-lg leading-tight text-slate-700 md:min-h-24 md:px-5 md:text-[1.45rem]">
                                    {option}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </article>

                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Explication
                        </p>
                        <p className="mt-1">{selectedQuestion.explanation}</p>
                      </div>

                      <p className="text-sm font-semibold text-emerald-700">
                        Bonne reponse: {String.fromCharCode(65 + selectedQuestion.correctOptionIndex)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600">Selectionnez une question.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}
