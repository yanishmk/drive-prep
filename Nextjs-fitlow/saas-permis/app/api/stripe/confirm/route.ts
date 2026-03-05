import { NextRequest, NextResponse } from "next/server";
import {
  activateUserSubscription,
  getAccessState,
  getUserFromAccessToken,
  recordStripePayment,
} from "@/lib/server/supabaseServer";
import { isPlanCode, type PlanCode } from "@/lib/saas/plans";

function getBearerToken(request: NextRequest): string | null {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.toLowerCase().startsWith("bearer ")) return null;
  return auth.slice(7).trim();
}

function getStripeSecretKey() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY manquant.");
  return key;
}

async function parseStripeJson<T>(response: Response): Promise<T> {
  const raw = await response.text();
  if (!raw) return {} as T;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return {} as T;
  }
}

type StripeCheckoutSession = {
  id: string;
  amount_total?: number | null;
  currency?: string | null;
  payment_status?: string;
  status?: string;
  payment_intent?: string | null;
  metadata?: {
    user_id?: string;
    plan_code?: string;
  };
  customer_email?: string | null;
};

export async function POST(request: NextRequest) {
  try {
    const token = getBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: "Non autorise." }, { status: 401 });
    }

    const user = await getUserFromAccessToken(token);
    let sessionId: string | undefined;
    const rawBody = await request.text();
    if (rawBody) {
      try {
        const body = JSON.parse(rawBody) as { sessionId?: string };
        sessionId = body.sessionId?.trim();
      } catch {
        // Ignore malformed JSON and fallback to query param.
      }
    }

    if (!sessionId) {
      sessionId = request.nextUrl.searchParams.get("session_id")?.trim();
    }

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId requis." }, { status: 400 });
    }

    const stripeKey = getStripeSecretKey();
    const stripeResponse = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      {
        headers: {
          Authorization: `Bearer ${stripeKey}`,
        },
      }
    );

    const stripeJson = await parseStripeJson<StripeCheckoutSession & {
      error?: { message?: string };
    }>(stripeResponse);

    if (!stripeResponse.ok) {
      return NextResponse.json(
        { error: stripeJson.error?.message ?? "Session Stripe introuvable." },
        { status: 400 }
      );
    }

    const paid =
      stripeJson.payment_status === "paid" ||
      stripeJson.status === "complete";
    if (!paid) {
      return NextResponse.json(
        { error: "Paiement non confirme pour cette session." },
        { status: 400 }
      );
    }

    const metadataUserId = stripeJson.metadata?.user_id;
    if (metadataUserId && metadataUserId !== user.id) {
      return NextResponse.json(
        { error: "Session Stripe non associee a cet utilisateur." },
        { status: 403 }
      );
    }

    const planCode: PlanCode = isPlanCode(stripeJson.metadata?.plan_code)
      ? stripeJson.metadata.plan_code
      : "pro";

    await activateUserSubscription(user.id, planCode);
    await recordStripePayment({
      userId: user.id,
      stripeSessionId: stripeJson.id,
      amountCents: stripeJson.amount_total ?? null,
      currency: stripeJson.currency ?? null,
      paymentStatus: stripeJson.payment_status ?? stripeJson.status ?? "paid",
      customerEmail: stripeJson.customer_email ?? user.email ?? null,
      stripePaymentIntentId: stripeJson.payment_intent ?? null,
    });
    const access = await getAccessState(user.id, user.email);
    return NextResponse.json({ ok: true, access });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Impossible de confirmer le paiement.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
