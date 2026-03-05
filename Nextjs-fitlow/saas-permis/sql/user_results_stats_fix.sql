-- Fix compatibility for personal stats storage.
-- Run once in Supabase SQL editor.

BEGIN;

CREATE TABLE IF NOT EXISTS public.user_results (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_id INT NOT NULL CHECK (exam_id > 0),
  attempt_no INT NOT NULL DEFAULT 1 CHECK (attempt_no > 0),
  total_questions SMALLINT NOT NULL CHECK (total_questions > 0),
  correct_answers SMALLINT NOT NULL CHECK (correct_answers >= 0),
  score_percent NUMERIC(5,2) NOT NULL CHECK (score_percent BETWEEN 0 AND 100),
  passed BOOLEAN NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  errors JSONB NOT NULL DEFAULT '{"list":[],"sections":[]}'::jsonb,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, exam_id, attempt_no),
  CHECK (correct_answers <= total_questions)
);

-- Drop any FK from user_results.exam_id -> exams(id) because exams are local in app code.
DO $$
DECLARE row_item RECORD;
BEGIN
  FOR row_item IN
    SELECT tc.constraint_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON kcu.constraint_schema = tc.constraint_schema
      AND kcu.constraint_name = tc.constraint_name
    JOIN information_schema.constraint_column_usage ccu
      ON ccu.constraint_schema = tc.constraint_schema
      AND ccu.constraint_name = tc.constraint_name
    WHERE tc.table_schema = 'public'
      AND tc.table_name = 'user_results'
      AND tc.constraint_type = 'FOREIGN KEY'
      AND kcu.column_name = 'exam_id'
      AND ccu.table_name = 'exams'
  LOOP
    EXECUTE format('ALTER TABLE public.user_results DROP CONSTRAINT %I', row_item.constraint_name);
  END LOOP;
END
$$;

CREATE INDEX IF NOT EXISTS idx_user_results_user_id
  ON public.user_results(user_id);

CREATE INDEX IF NOT EXISTS idx_user_results_exam_id
  ON public.user_results(exam_id);

CREATE INDEX IF NOT EXISTS idx_user_results_completed_at
  ON public.user_results(completed_at DESC);

ALTER TABLE public.user_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "results_select_own" ON public.user_results;
CREATE POLICY "results_select_own"
ON public.user_results
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "results_insert_own" ON public.user_results;
CREATE POLICY "results_insert_own"
ON public.user_results
FOR INSERT
WITH CHECK (auth.uid() = user_id);

COMMIT;
