import { getPlanConfig, isPlanCode, type PlanCode } from "@/lib/saas/plans";
import { getQuestionById } from "@/lib/permis/questionBank";

type SupabaseAuthUser = {
  id: string;
  email?: string;
};

export type AccessState = {
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

const FREE_EXAM_ID = 1;

function getPublicSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Configuration Supabase publique manquante (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)."
    );
  }

  return { url, publishableKey };
}

function getServiceRoleKey() {
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRole) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY est manquant.");
  }
  return serviceRole;
}

async function supabaseAdminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { url } = getPublicSupabaseConfig();
  const serviceRole = getServiceRoleKey();
  const response = await fetch(`${url}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      ...(init?.headers ?? {}),
    },
  });

  const raw = await response.text();

  if (!response.ok) {
    throw new Error(`Supabase admin error ${response.status}: ${raw}`);
  }

  if (response.status === 204 || !raw.trim()) {
    return undefined as T;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error(
      `Supabase admin returned non-JSON body on ${path} (status ${response.status}).`
    );
  }
}

async function supabaseAdminCount(path: string): Promise<number> {
  const { url } = getPublicSupabaseConfig();
  const serviceRole = getServiceRoleKey();
  const response = await fetch(`${url}${path}`, {
    headers: {
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      Prefer: "count=exact",
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase count error ${response.status}: ${body}`);
  }

  const contentRange = response.headers.get("content-range");
  if (!contentRange) return 0;
  const totalPart = contentRange.split("/")[1];
  const parsed = Number(totalPart);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function getUserFromAccessToken(accessToken: string): Promise<SupabaseAuthUser> {
  const { url, publishableKey } = getPublicSupabaseConfig();
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Session invalide ou expiree.");
  }

  return (await response.json()) as SupabaseAuthUser;
}

export async function getAccessState(userId: string, email?: string): Promise<AccessState> {
  const subscriptions = await supabaseAdminFetch<
    Array<{ id: number; status: string; plan_code: string | null; ends_at: string | null }>
  >(
    `/rest/v1/user_subscriptions?select=id,status,plan_code,ends_at&user_id=eq.${encodeURIComponent(
      userId
    )}&order=started_at.desc&order=created_at.desc&limit=10`
  );

  const now = Date.now();
  const activeSubscription = subscriptions.find((sub) => {
    if (sub.status !== "active") return false;
    if (!sub.ends_at) return true;
    return new Date(sub.ends_at).getTime() > now;
  });

  const planCode: PlanCode | null =
    activeSubscription?.plan_code && isPlanCode(activeSubscription.plan_code)
      ? activeSubscription.plan_code
      : activeSubscription
        ? "pro"
        : null;

  const plan = planCode ? getPlanConfig(planCode) : null;
  const hasPaidAccess = Boolean(activeSubscription && plan);
  const accessibleExamCount = hasPaidAccess && plan ? plan.examsIncluded : 1;
  const strictMode = hasPaidAccess && plan ? plan.strictMode : false;

  const freeAttempts = await supabaseAdminFetch<Array<{ user_id: string }>>(
    `/rest/v1/free_exam_attempts?select=user_id&user_id=eq.${encodeURIComponent(userId)}&limit=1`
  );

  return {
    userId,
    email,
    planCode,
    planName: plan?.name ?? "FREE",
    expiresAt: activeSubscription?.ends_at ?? null,
    hasPaidAccess,
    freeTrialUsed: freeAttempts.length > 0,
    freeExamId: FREE_EXAM_ID,
    accessibleExamCount,
    strictMode,
  };
}

export async function consumeFreeTrialExam(userId: string, examId: number): Promise<void> {
  await supabaseAdminFetch("/rest/v1/free_exam_attempts", {
    method: "POST",
    headers: {
      Prefer: "resolution=ignore-duplicates,return=minimal",
    },
    body: JSON.stringify({
      user_id: userId,
      exam_id: examId,
      used_at: new Date().toISOString(),
    }),
  });
}

export async function activateUserSubscription(
  userId: string,
  planCode: PlanCode = "pro"
): Promise<void> {
  const plan = getPlanConfig(planCode);
  const startedAt = new Date();
  const endsAt = new Date(startedAt.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);

  const existing = await supabaseAdminFetch<Array<{ id: number }>>(
    `/rest/v1/user_subscriptions?select=id&user_id=eq.${encodeURIComponent(
      userId
    )}&order=created_at.desc&limit=1`
  );

  if (existing.length > 0) {
    const id = existing[0].id;
    await supabaseAdminFetch(`/rest/v1/user_subscriptions?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        status: "active",
        plan_code: plan.code,
        started_at: startedAt.toISOString(),
        ends_at: endsAt.toISOString(),
      }),
    });
    return;
  }

  await supabaseAdminFetch("/rest/v1/user_subscriptions", {
    method: "POST",
    headers: {
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      user_id: userId,
      status: "active",
      plan_code: plan.code,
      started_at: startedAt.toISOString(),
      ends_at: endsAt.toISOString(),
    }),
  });
}

export async function recordStripePayment(input: {
  userId: string;
  stripeSessionId: string;
  amountCents?: number | null;
  currency?: string | null;
  paymentStatus?: string | null;
  customerEmail?: string | null;
  stripePaymentIntentId?: string | null;
}): Promise<void> {
  await supabaseAdminFetch("/rest/v1/payments", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({
      user_id: input.userId,
      provider: "stripe",
      stripe_session_id: input.stripeSessionId,
      stripe_payment_intent_id: input.stripePaymentIntentId ?? null,
      amount_cents: input.amountCents ?? null,
      currency: input.currency ?? null,
      status: input.paymentStatus ?? "paid",
      customer_email: input.customerEmail ?? null,
      paid_at: new Date().toISOString(),
    }),
  });
}

export async function getUserPayments(userId: string): Promise<
  Array<{
    id: number;
    amount_cents: number | null;
    currency: string | null;
    status: string;
    paid_at: string;
    stripe_session_id: string;
  }>
> {
  return supabaseAdminFetch(
    `/rest/v1/payments?select=id,amount_cents,currency,status,paid_at,stripe_session_id&user_id=eq.${encodeURIComponent(
      userId
    )}&order=paid_at.desc&limit=20`
  );
}

export async function getAdminOverview(): Promise<{
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
}> {
  const [usersCount, paidSubscriptionsCount, freeTrialsUsedCount, paymentsCount, payments] =
    await Promise.all([
      supabaseAdminCount("/rest/v1/user_profiles?select=id"),
      supabaseAdminCount("/rest/v1/user_subscriptions?select=id&status=eq.active"),
      supabaseAdminCount("/rest/v1/free_exam_attempts?select=user_id"),
      supabaseAdminCount("/rest/v1/payments?select=id"),
      supabaseAdminFetch<
        Array<{
          id: number;
          customer_email: string | null;
          amount_cents: number | null;
          currency: string | null;
          status: string;
          paid_at: string;
        }>
      >(
        "/rest/v1/payments?select=id,customer_email,amount_cents,currency,status,paid_at&order=paid_at.desc&limit=20"
      ),
    ]);

  const revenueCents = payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + (payment.amount_cents ?? 0), 0);

  return {
    usersCount,
    paidSubscriptionsCount,
    freeTrialsUsedCount,
    paymentsCount,
    revenueCents,
    latestPayments: payments,
  };
}

type SaveResultInput = {
  userId: string;
  examId: number;
  totalQuestions: number;
  correctAnswers: number;
  scorePercent: number;
  passed: boolean;
  answers: Record<string, number | null | undefined>;
  errors: Array<{
    questionId: string;
    reponseUtilisateur: number | null;
    reponseCorrecte: number;
  }>;
  sectionScores?: Array<{
    section: string;
    correct: number;
    total: number;
    score: number;
  }>;
};

async function ensureExamRecord(examId: number): Promise<void> {
  try {
    const rows = await supabaseAdminFetch<Array<{ id: number }>>(
      `/rest/v1/exams?select=id&id=eq.${examId}&limit=1`
    );
    if (rows.length > 0) return;

    await supabaseAdminFetch("/rest/v1/exams", {
      method: "POST",
      headers: {
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        id: examId,
        title: `Examen ${examId}`,
        description: "Examen local synchronise automatiquement.",
        question_count: 25,
        pass_threshold: 80,
        is_active: true,
      }),
    });
  } catch {
    // Compatible mode: if exams table is missing, keep going.
    // user_results may not have a FK to exams in some deployments.
  }
}

export async function saveUserResult(input: SaveResultInput): Promise<void> {
  await ensureExamRecord(input.examId);

  let latest: Array<{ attempt_no: number }> = [];
  try {
    latest = await supabaseAdminFetch<Array<{ attempt_no: number }>>(
      `/rest/v1/user_results?select=attempt_no&user_id=eq.${encodeURIComponent(
        input.userId
      )}&exam_id=eq.${input.examId}&order=attempt_no.desc&limit=1`
    );
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Erreur inconnue.";
    throw new Error(
      `Lecture user_results impossible. Verifie la table user_results dans Supabase. Detail: ${reason}`
    );
  }
  const attemptNo = (latest[0]?.attempt_no ?? 0) + 1;

  try {
    await supabaseAdminFetch("/rest/v1/user_results?on_conflict=user_id,exam_id,attempt_no", {
      method: "POST",
      headers: {
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({
        user_id: input.userId,
        exam_id: input.examId,
        attempt_no: attemptNo,
        total_questions: input.totalQuestions,
        correct_answers: input.correctAnswers,
        score_percent: input.scorePercent,
        passed: input.passed,
        answers: input.answers,
        errors: {
          list: input.errors,
          sections: input.sectionScores ?? [],
        },
        completed_at: new Date().toISOString(),
      }),
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Erreur inconnue.";
    throw new Error(
      `Insertion user_results impossible. Verifie user_results (colonnes et contraintes). Detail: ${reason}`
    );
  }
}

export async function getUserStats(userId: string): Promise<{
  attempts: number;
  averageScore: number;
  bestScore: number;
  passRate: number;
  weakCategories: Array<{ category: string; mistakes: number }>;
  recommendations: string[];
}> {
  const results = await supabaseAdminFetch<
    Array<{
      score_percent: number;
      passed: boolean;
      errors: unknown;
    }>
  >(
    `/rest/v1/user_results?select=score_percent,passed,errors&user_id=eq.${encodeURIComponent(
      userId
    )}&order=completed_at.desc&limit=100`
  );

  if (results.length === 0) {
    return {
      attempts: 0,
      averageScore: 0,
      bestScore: 0,
      passRate: 0,
      weakCategories: [],
      recommendations: [
        "Passe ton premier examen pour activer des recommandations personnalisees.",
      ],
    };
  }

  const attempts = results.length;
  const averageScore = Number(
    (results.reduce((sum, row) => sum + (row.score_percent ?? 0), 0) / attempts).toFixed(2)
  );
  const bestScore = Number(
    Math.max(...results.map((row) => row.score_percent ?? 0)).toFixed(2)
  );
  const passRate = Number(
    (
      (results.filter((row) => row.passed).length / attempts) *
      100
    ).toFixed(2)
  );

  const categoryMistakes = new Map<string, number>();
  for (const row of results) {
    const errors =
      row.errors && typeof row.errors === "object" && "list" in (row.errors as object)
        ? ((row.errors as { list?: Array<{ questionId?: string }> }).list ?? [])
        : [];
    for (const error of errors) {
      const questionId = error.questionId;
      if (!questionId) continue;
      const category = getQuestionById(questionId)?.category ?? "Autre";
      categoryMistakes.set(category, (categoryMistakes.get(category) ?? 0) + 1);
    }
  }

  const weakCategories = [...categoryMistakes.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category, mistakes]) => ({ category, mistakes }));

  const recommendations =
    weakCategories.length === 0
      ? [
          "Tes derniers resultats sont stables. Continue avec le mode strict pour consolider.",
        ]
      : weakCategories.map((entry) =>
          `Travaille ${entry.category}: refais 2 examens axes sur cette categorie et relis les explications.`
        );

  return {
    attempts,
    averageScore,
    bestScore,
    passRate,
    weakCategories,
    recommendations,
  };
}
