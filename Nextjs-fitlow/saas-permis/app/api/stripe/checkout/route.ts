import { NextRequest, NextResponse } from "next/server";
import { getAccessState, getUserFromAccessToken } from "@/lib/server/supabaseServer";
import { getPlanConfig, isPlanCode, type PlanCode } from "@/lib/saas/plans";

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

export async function POST(request: NextRequest) {
  try {
    const token = getBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: "Non autorise." }, { status: 401 });
    }

    let selectedPlan: PlanCode = "pro";
    const rawBody = await request.text();
    if (rawBody) {
      try {
        const body = JSON.parse(rawBody) as { plan?: string };
        if (isPlanCode(body.plan)) {
          selectedPlan = body.plan;
        }
      } catch {
        // Keep default plan.
      }
    }

    const stripeKey = getStripeSecretKey();
    const user = await getUserFromAccessToken(token);
    const access = await getAccessState(user.id, user.email);

    if (access.hasPaidAccess) {
      return NextResponse.json({ error: "Acces deja actif." }, { status: 400 });
    }

    const origin = request.nextUrl.origin;
    const successUrl = `${origin}/simulations?checkout=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/simulations?checkout=cancel`;
    const plan = getPlanConfig(selectedPlan);
    const stripePriceId =
      selectedPlan === "basic"
        ? process.env.STRIPE_PRICE_ID_BASIC
        : process.env.STRIPE_PRICE_ID_PRO ?? process.env.STRIPE_PRICE_ID;

    const params = new URLSearchParams();
    params.append("mode", "payment");
    params.append("success_url", successUrl);
    params.append("cancel_url", cancelUrl);
    params.append("customer_email", user.email ?? "");
    params.append("metadata[user_id]", user.id);
    params.append("metadata[source]", "drive_prep");
    params.append("metadata[plan_code]", plan.code);
    params.append("metadata[duration_days]", String(plan.durationDays));
    params.append("line_items[0][quantity]", "1");

    if (stripePriceId) {
      params.append("line_items[0][price]", stripePriceId);
    } else {
      params.append("line_items[0][price_data][currency]", "cad");
      params.append("line_items[0][price_data][unit_amount]", String(plan.priceCents));
      params.append("line_items[0][price_data][product_data][name]", `Plan ${plan.name} Drive-Prep`);
      params.append(
        "line_items[0][price_data][product_data][description]",
        `${plan.examsIncluded} examens, acces ${plan.durationDays} jours.`
      );
    }

    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const stripeJson = await parseStripeJson<{ url?: string; error?: { message?: string } }>(
      stripeResponse
    );
    if (!stripeResponse.ok || !stripeJson.url) {
      const message = stripeJson.error?.message ?? "Impossible de creer la session Stripe.";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ url: stripeJson.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erreur lors de la creation du paiement.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
