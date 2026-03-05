-- Extra SaaS access tables for Stripe + free trial logic.
-- Run in Supabase SQL editor.

BEGIN;

CREATE TABLE IF NOT EXISTS public.free_exam_attempts (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_id INT NOT NULL DEFAULT 1 CHECK (exam_id > 0),
  used_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_free_exam_attempts_used_at
  ON public.free_exam_attempts(used_at DESC);

ALTER TABLE public.free_exam_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "free_attempts_select_own" ON public.free_exam_attempts;
CREATE POLICY "free_attempts_select_own"
ON public.free_exam_attempts
FOR SELECT
USING (auth.uid() = user_id);

COMMIT;
