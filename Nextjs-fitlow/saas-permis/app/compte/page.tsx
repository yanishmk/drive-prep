"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clearStoredSession, getStoredSession } from "@/lib/supabase/auth";
import { PLAN_CONFIG, type PlanCode } from "@/lib/saas/plans";

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
};

type PaymentItem = {
  id: number;
  amount_cents: number | null;
  currency: string | null;
  status: string;
  paid_at: string;
  stripe_session_id: string;
};

type UserStats = {
  attempts: number;
  averageScore: number;
  bestScore: number;
  passRate: number;
  weakCategories: Array<{ category: string; mistakes: number }>;
  recommendations: string[];
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

export default function ComptePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [access, setAccess] = useState<AccessInfo | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [canAccessAdmin, setCanAccessAdmin] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanCode>("pro");
  const [stats, setStats] = useState<UserStats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  async function loadAccess() {
    setLoading(true);
    setError(null);
    const session = getStoredSession();
    if (!session?.access_token) {
      setError("Aucune session active.");
      setLoading(false);
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
        throw new Error(json.error ?? "Impossible de charger les informations du compte.");
      }
      setAccess(json);
      if (json.email) {
        const raw = process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "";
        const admins = raw
          .split(",")
          .map((item) => item.trim().toLowerCase())
          .filter(Boolean);
        setCanAccessAdmin(admins.includes(json.email.toLowerCase()));
      }

      const paymentsResponse = await fetch("/api/payments", {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      const paymentsJson = await parseApiJson<{ payments?: PaymentItem[] }>(paymentsResponse);
      if (paymentsResponse.ok && paymentsJson.payments) {
        setPayments(paymentsJson.payments);
      }

      const statsResponse = await fetch("/api/stats", {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      const statsJson = await parseApiJson<{ stats?: UserStats; error?: string }>(statsResponse);
      if (statsResponse.ok && statsJson.stats) {
        setStats(statsJson.stats);
        setStatsError(null);
      } else if (statsResponse.ok) {
        setStats(null);
        setStatsError("Aucune statistique disponible pour le moment.");
      } else {
        setStats(null);
        setStatsError(
          statsJson.error ??
            "Impossible de charger les statistiques. Verifie la table user_results dans Supabase."
        );
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Impossible de charger les informations du compte.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAccess();
  }, []);

  async function openStripeCheckout() {
    const session = getStoredSession();
    if (!session?.access_token) {
      setError("Session absente. Connecte-toi a nouveau.");
      return;
    }

    try {
      setPaymentLoading(true);
      setNotice(null);
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
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors du paiement.";
      setNotice(message);
    } finally {
      setPaymentLoading(false);
    }
  }

  function logout() {
    clearStoredSession();
    window.location.href = "/";
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-10">
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">Compte</p>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight">Mon espace client</h1>

        {loading ? <p className="mt-4 text-sm text-slate-600">Chargement...</p> : null}

        {!loading && error ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <p>{error}</p>
            <div className="mt-3 flex gap-3">
              <Link
                href="/connexion"
                className="rounded-full bg-slate-900 px-4 py-2 font-semibold text-white"
              >
                Connexion
              </Link>
              <Link
                href="/inscription"
                className="rounded-full border border-slate-300 px-4 py-2 font-semibold text-slate-700"
              >
                Inscription
              </Link>
            </div>
          </div>
        ) : null}

        {!loading && access ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Email</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{access.email ?? "N/A"}</p>
            </div>

            {access.hasPaidAccess && access.planCode === "pro" && stats ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
                  Statistiques personnelles
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-4">
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs text-slate-500">Tentatives</p>
                    <p className="text-lg font-semibold">{stats.attempts}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs text-slate-500">Moyenne</p>
                    <p className="text-lg font-semibold">{stats.averageScore}%</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs text-slate-500">Meilleur score</p>
                    <p className="text-lg font-semibold">{stats.bestScore}%</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs text-slate-500">Taux reussite</p>
                    <p className="text-lg font-semibold">{stats.passRate}%</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-sm font-semibold text-slate-800">Categories a renforcer</p>
                    {stats.weakCategories.length === 0 ? (
                      <p className="mt-2 text-sm text-slate-600">Aucune faiblesse dominante detectee.</p>
                    ) : (
                      <ul className="mt-2 space-y-1 text-sm text-slate-700">
                        {stats.weakCategories.map((item) => (
                          <li key={item.category}>
                            - {item.category}: {item.mistakes} erreurs
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-sm font-semibold text-slate-800">Recommandations</p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-700">
                      {stats.recommendations.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}

            {access.hasPaidAccess && access.planCode === "pro" && statsError ? (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                {statsError}
              </p>
            ) : null}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Statut abonnement</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {access.hasPaidAccess
                  ? `Plan actif - ${access.planName} (${access.accessibleExamCount} examens)`
                  : "Plan gratuit"}
              </p>
              {access.hasPaidAccess && access.expiresAt ? (
                <p className="mt-1 text-sm text-slate-600">
                  Expire le {new Date(access.expiresAt).toLocaleDateString("fr-CA")}
                </p>
              ) : null}
              {!access.hasPaidAccess ? (
                <p className="mt-1 text-sm text-slate-600">
                  {access.freeTrialUsed
                    ? "Essai gratuit utilise."
                    : `Essai gratuit disponible (Examen ${access.freeExamId}).`}
                </p>
              ) : null}
            </div>

            {notice ? (
              <p className="rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-800">
                {notice}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-3">
              {!access.hasPaidAccess ? (
                <>
                  <select
                    value={selectedPlan}
                    onChange={(event) => setSelectedPlan(event.target.value as PlanCode)}
                    className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
                  >
                    <option value="basic">
                      BASIC - {PLAN_CONFIG.basic.priceLabel} - 10j / 10 examens
                    </option>
                    <option value="pro">
                      PRO - {PLAN_CONFIG.pro.priceLabel} - 30j / 20 examens
                    </option>
                  </select>
                  <button
                    onClick={openStripeCheckout}
                    disabled={paymentLoading}
                    className="rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:opacity-60"
                  >
                    {paymentLoading
                      ? "Redirection Stripe..."
                      : `Payer plan ${selectedPlan.toUpperCase()}`}
                  </button>
                </>
              ) : (
                <Link
                  href="/simulations"
                  className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Aller aux simulations
                </Link>
              )}

              <button
                onClick={logout}
                className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Deconnexion
              </button>
              {canAccessAdmin ? (
                <Link
                  href="/admin"
                  className="rounded-full border border-teal-300 bg-teal-50 px-5 py-2.5 text-sm font-semibold text-teal-700 transition hover:bg-teal-100"
                >
                  Ouvrir admin
                </Link>
              ) : null}
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Historique paiements</p>
              {payments.length === 0 ? (
                <p className="mt-2 text-sm text-slate-600">Aucun paiement enregistre.</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                    >
                      <p className="font-semibold">
                        {(payment.amount_cents ?? 0) / 100}{" "}
                        {(payment.currency ?? "cad").toUpperCase()} - {payment.status}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(payment.paid_at).toLocaleString("fr-CA")} - session{" "}
                        {payment.stripe_session_id}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
