-- Payments history table for Drive-Prep.
-- Run in Supabase SQL editor.

BEGIN;

CREATE TABLE IF NOT EXISTS public.payments (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'stripe',
  stripe_session_id TEXT NOT NULL UNIQUE,
  stripe_payment_intent_id TEXT,
  amount_cents INT,
  currency TEXT,
  status TEXT NOT NULL DEFAULT 'paid',
  customer_email TEXT,
  paid_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id
  ON public.payments(user_id);

CREATE INDEX IF NOT EXISTS idx_payments_paid_at
  ON public.payments(paid_at DESC);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "payments_select_own" ON public.payments;
CREATE POLICY "payments_select_own"
ON public.payments
FOR SELECT
USING (auth.uid() = user_id);

COMMIT;
