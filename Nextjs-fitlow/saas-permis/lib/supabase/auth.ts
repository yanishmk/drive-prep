export type SignUpProfileInput = {
  firstName: string;
  lastName: string;
  phone?: string;
  birthDate?: string;
  city?: string;
};

type SupabaseAuthError = {
  message?: string;
  error_description?: string;
  error?: string;
};

type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
};

type SupabaseSession = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: SupabaseUser;
};

const STORAGE_KEY = "drive_prep_session";

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Configuration Supabase manquante. Ajoute NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
  }

  return { url, key };
}

function getErrorMessage(payload: SupabaseAuthError | null | undefined) {
  if (!payload) return "Une erreur est survenue.";
  return (
    payload.message ||
    payload.error_description ||
    payload.error ||
    "Une erreur est survenue."
  );
}

export function setStoredSession(session: SupabaseSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function getStoredSession(): SupabaseSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SupabaseSession;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearStoredSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

async function upsertProfile(
  userId: string,
  accessToken: string,
  profile: SignUpProfileInput
) {
  const { url, key } = getSupabaseConfig();
  const payload = {
    id: userId,
    first_name: profile.firstName.trim(),
    last_name: profile.lastName.trim(),
    phone: profile.phone?.trim() || null,
    birth_date: profile.birthDate || null,
    city: profile.city?.trim() || null,
  };

  const response = await fetch(`${url}/rest/v1/user_profiles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: key,
      Authorization: `Bearer ${accessToken}`,
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "Impossible de sauvegarder le profil.";
    try {
      const json = (await response.json()) as SupabaseAuthError;
      message = getErrorMessage(json);
    } catch {
      // Ignore JSON parsing errors and keep fallback message.
    }
    throw new Error(message);
  }
}

export async function signUpWithProfile(input: {
  email: string;
  password: string;
  profile: SignUpProfileInput;
}) {
  const { url, key } = getSupabaseConfig();
  const emailRedirectTo =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback?from=signup`
      : undefined;

  const response = await fetch(`${url}/auth/v1/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: key,
    },
    body: JSON.stringify({
      email: input.email.trim(),
      password: input.password,
      data: {
        first_name: input.profile.firstName.trim(),
        last_name: input.profile.lastName.trim(),
      },
      email_redirect_to: emailRedirectTo,
    }),
  });

  const json = (await response.json()) as {
    user?: SupabaseUser;
    session?: SupabaseSession | null;
    code?: number;
    msg?: string;
    error_code?: string;
    message?: string;
    error_description?: string;
    error?: string;
  };

  if (!response.ok) {
    throw new Error(getErrorMessage(json));
  }

  if (json.session && json.user?.id) {
    await upsertProfile(json.user.id, json.session.access_token, input.profile);
    setStoredSession(json.session);
    return { requiresEmailConfirmation: false };
  }

  return { requiresEmailConfirmation: true };
}

export async function signInWithPassword(input: {
  email: string;
  password: string;
}) {
  const { url, key } = getSupabaseConfig();
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: key,
    },
    body: JSON.stringify({
      email: input.email.trim(),
      password: input.password,
    }),
  });

  const json = (await response.json()) as SupabaseSession & SupabaseAuthError;
  if (!response.ok) {
    throw new Error(getErrorMessage(json));
  }

  setStoredSession(json);
  return json;
}
