-- Supabase auth + personal data schema for Drive-Prep
-- Run this in Supabase SQL Editor after the base schema.

BEGIN;

-- Keep updated_at in sync on profile updates.
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Personal info linked 1:1 with Supabase auth.users.
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL CHECK (length(trim(first_name)) >= 2),
  last_name TEXT NOT NULL CHECK (length(trim(last_name)) >= 2),
  phone TEXT,
  birth_date DATE,
  city TEXT,
  province TEXT NOT NULL DEFAULT 'QC',
  preferred_language TEXT NOT NULL DEFAULT 'fr'
    CHECK (preferred_language IN ('fr', 'en')),
  marketing_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
  terms_accepted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_user_profiles_set_updated_at ON public.user_profiles;
CREATE TRIGGER trg_user_profiles_set_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_user_profiles_city
  ON public.user_profiles(city);

CREATE INDEX IF NOT EXISTS idx_user_profiles_language
  ON public.user_profiles(preferred_language);

-- Optional commercial plan tracking.
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_code TEXT NOT NULL DEFAULT 'pack_20',
  status TEXT NOT NULL DEFAULT 'trial'
    CHECK (status IN ('trial', 'active', 'past_due', 'canceled')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_user_subscriptions_set_updated_at ON public.user_subscriptions;
CREATE TRIGGER trg_user_subscriptions_set_updated_at
BEFORE UPDATE ON public.user_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id
  ON public.user_subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status
  ON public.user_subscriptions(status);

CREATE UNIQUE INDEX IF NOT EXISTS uq_user_active_subscription
  ON public.user_subscriptions(user_id)
  WHERE status IN ('trial', 'active', 'past_due');

-- Audit of auth events triggered by app backend.
CREATE TABLE IF NOT EXISTS public.auth_audit_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT,
  event_type TEXT NOT NULL
    CHECK (event_type IN ('signup', 'signin', 'signout', 'password_reset')),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_auth_audit_log_user_id
  ON public.auth_audit_log(user_id);

CREATE INDEX IF NOT EXISTS idx_auth_audit_log_created_at
  ON public.auth_audit_log(created_at DESC);

-- Strengthen user_results relation to auth.users if table exists.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'user_results'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints tc
    WHERE tc.constraint_schema = 'public'
      AND tc.table_name = 'user_results'
      AND tc.constraint_name = 'fk_user_results_user_auth'
  ) THEN
    ALTER TABLE public.user_results
      ADD CONSTRAINT fk_user_results_user_auth
      FOREIGN KEY (user_id)
      REFERENCES auth.users(id)
      ON DELETE CASCADE;
  END IF;
END
$$;

-- RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_audit_log ENABLE ROW LEVEL SECURITY;

-- Users can read and write only their own profile.
DROP POLICY IF EXISTS "profiles_select_own" ON public.user_profiles;
CREATE POLICY "profiles_select_own"
ON public.user_profiles
FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON public.user_profiles;
CREATE POLICY "profiles_insert_own"
ON public.user_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.user_profiles;
CREATE POLICY "profiles_update_own"
ON public.user_profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can read their own subscription; writes should be done by backend/service role.
DROP POLICY IF EXISTS "subscriptions_select_own" ON public.user_subscriptions;
CREATE POLICY "subscriptions_select_own"
ON public.user_subscriptions
FOR SELECT
USING (auth.uid() = user_id);

-- Users can read their own exam results if table exists.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'user_results'
  ) THEN
    EXECUTE 'ALTER TABLE public.user_results ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "results_select_own" ON public.user_results';
    EXECUTE '
      CREATE POLICY "results_select_own"
      ON public.user_results
      FOR SELECT
      USING (auth.uid() = user_id)
    ';
    EXECUTE 'DROP POLICY IF EXISTS "results_insert_own" ON public.user_results';
    EXECUTE '
      CREATE POLICY "results_insert_own"
      ON public.user_results
      FOR INSERT
      WITH CHECK (auth.uid() = user_id)
    ';
  END IF;
END
$$;

COMMIT;
