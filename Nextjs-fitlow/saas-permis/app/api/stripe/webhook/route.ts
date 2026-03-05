import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { activateUserSubscription, recordStripePayment } from "@/lib/server/supabaseServer";
import { isPlanCode, type PlanCode } from "@/lib/saas/plans";

function getWebhookSecret() {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("STRIPE_WEBHOOK_SECRET manquant.");
  }
  return secret;
}

function verifyStripeSignature(payload: string, signatureHeader: string, secret: string): boolean {
  const parts = signatureHeader.split(",").map((part) => part.trim());
  const timestamp = parts.find((part) => part.startsWith("t="))?.slice(2);
  const expectedSignatures = parts
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.slice(3));

  if (!timestamp || expectedSignatures.length === 0) {
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const computed = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");

  return expectedSignatures.some((sig) => {
    try {
      return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(computed));
    } catch {
      return false;
    }
  });
}

type StripeEvent = {
  type: string;
  data?: {
    object?: {
      id?: string;
      amount_total?: number | null;
      currency?: string | null;
      payment_status?: string;
      status?: string;
      payment_intent?: string | null;
      customer_email?: string | null;
      metadata?: {
        user_id?: string;
        plan_code?: string;
      };
    };
  };
};

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json({ error: "Signature Stripe absente." }, { status: 400 });
    }

    const rawBody = await request.text();
    const secret = getWebhookSecret();
    const isValid = verifyStripeSignature(rawBody, signature, secret);
    if (!isValid) {
      return NextResponse.json({ error: "Signature Stripe invalide." }, { status: 400 });
    }

    const event = JSON.parse(rawBody) as StripeEvent;
    if (event.type === "checkout.session.completed") {
      const userId = event.data?.object?.metadata?.user_id;
      const sessionId = event.data?.object?.id;
      if (userId) {
        const planCode: PlanCode = isPlanCode(event.data?.object?.metadata?.plan_code)
          ? event.data.object.metadata.plan_code
          : "pro";
        await activateUserSubscription(userId, planCode);
        if (sessionId) {
          await recordStripePayment({
            userId,
            stripeSessionId: sessionId,
            amountCents: event.data?.object?.amount_total ?? null,
            currency: event.data?.object?.currency ?? null,
            paymentStatus:
              event.data?.object?.payment_status ?? event.data?.object?.status ?? "paid",
            customerEmail: event.data?.object?.customer_email ?? null,
            stripePaymentIntentId: event.data?.object?.payment_intent ?? null,
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook Stripe en erreur.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
