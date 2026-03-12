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
const OAUTH_VERIFIER_KEY = "drive_prep_oauth_verifier";

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

function storeOAuthVerifier(verifier: string) {
  if (typeof window === "undefined") return;
  // Keep both stores to survive browser tab/open-mode differences.
  window.sessionStorage.setItem(OAUTH_VERIFIER_KEY, verifier);
  window.localStorage.setItem(OAUTH_VERIFIER_KEY, verifier);
}

function toBase64Url(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function toBase64UrlText(value: string) {
  const bytes = new TextEncoder().encode(value);
  return toBase64Url(bytes.buffer);
}

function createRandomVerifier(length = 64) {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const bytes = new Uint8Array(length);
  window.crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < bytes.length; i += 1) {
    out += charset[bytes[i] % charset.length];
  }
  return out;
}

async function createPkceChallenge(verifier: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return toBase64Url(digest);
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

export async function signInWithGoogle() {
  const { url, key } = getSupabaseConfig();
  const redirectTo =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback?from=oauth`
      : undefined;
  if (typeof window === "undefined") {
    throw new Error("Connexion Google disponible uniquement dans le navigateur.");
  }

  // PKCE flow: avoids fragile implicit token redirects and keeps callback stable.
  const verifier = createRandomVerifier(64);
  const challenge = await createPkceChallenge(verifier);
  storeOAuthVerifier(verifier);
  const statePayload = JSON.stringify({
    v: verifier,
    ts: Date.now(),
  });
  const state = toBase64UrlText(statePayload);

  const authorizeUrl = new URL(`${url}/auth/v1/authorize`);
  authorizeUrl.searchParams.set("provider", "google");
  authorizeUrl.searchParams.set("flow_type", "pkce");
  if (redirectTo) {
    authorizeUrl.searchParams.set("redirect_to", redirectTo);
  }
  authorizeUrl.searchParams.set("apikey", key);
  authorizeUrl.searchParams.set("code_challenge", challenge);
  authorizeUrl.searchParams.set("code_challenge_method", "s256");
  authorizeUrl.searchParams.set("state", state);

  window.location.assign(authorizeUrl.toString());
}

export function getStoredOAuthVerifier() {
  if (typeof window === "undefined") return null;
  return (
    window.sessionStorage.getItem(OAUTH_VERIFIER_KEY) ??
    window.localStorage.getItem(OAUTH_VERIFIER_KEY)
  );
}

export function clearStoredOAuthVerifier() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(OAUTH_VERIFIER_KEY);
  window.localStorage.removeItem(OAUTH_VERIFIER_KEY);
}
