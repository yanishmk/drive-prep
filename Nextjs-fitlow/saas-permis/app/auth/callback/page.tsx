"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setStoredSession } from "@/lib/supabase/auth";

type CallbackSession = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: {
    id: string;
    email?: string;
  };
};

function parseAuthParams() {
  if (typeof window === "undefined") return new URLSearchParams();
  const searchParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  const hashParams = new URLSearchParams(hash);
  const merged = new URLSearchParams(searchParams.toString());
  hashParams.forEach((value, key) => merged.set(key, value));
  return merged;
}

function getPublicSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url, key };
}

async function tryVerifyTokenHash(params: URLSearchParams): Promise<CallbackSession | null> {
  const tokenHash = params.get("token_hash");
  const type = params.get("type");
  const config = getPublicSupabaseConfig();
  if (!tokenHash || !type || !config) return null;

  const response = await fetch(`${config.url}/auth/v1/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: config.key,
    },
    body: JSON.stringify({
      token_hash: tokenHash,
      type,
    }),
  });

  const raw = await response.text();
  if (!response.ok || !raw) return null;

  let json: Partial<CallbackSession> = {};
  try {
    json = JSON.parse(raw) as Partial<CallbackSession>;
  } catch {
    return null;
  }

  if (!json.access_token || !json.refresh_token || !json.user?.id) return null;

  return {
    access_token: json.access_token,
    refresh_token: json.refresh_token,
    expires_in: Number(json.expires_in ?? 3600),
    token_type: json.token_type ?? "bearer",
    user: {
      id: json.user.id,
      email: json.user.email,
    },
  };
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [confirmedWithoutSession, setConfirmedWithoutSession] = useState(false);

  const statusText = useMemo(() => {
    if (error) return error;
    if (confirmedWithoutSession) {
      return "Confirmation reussie. Connecte-toi pour ouvrir ta session.";
    }
    if (done) return "Confirmation reussie. Redirection en cours...";
    return "Validation du lien de confirmation...";
  }, [confirmedWithoutSession, done, error]);

  useEffect(() => {
    let isActive = true;

    async function run() {
      const params = parseAuthParams();
      const errorDescription =
        params.get("error_description") ?? params.get("error");
      const fromSignup = params.get("from") === "signup" || params.get("type") === "signup";

      if (errorDescription) {
        if (isActive) setError(errorDescription);
        return;
      }

      let accessToken = params.get("access_token");
      let refreshToken = params.get("refresh_token");
      let expiresIn = Number(params.get("expires_in") ?? "3600");
      const tokenType = params.get("token_type") ?? "bearer";
      let userId = params.get("user_id") ?? params.get("sub") ?? params.get("id");
      let email = params.get("email") ?? undefined;

      if (!accessToken || !refreshToken) {
        const verifiedSession = await tryVerifyTokenHash(params);
        if (verifiedSession) {
          accessToken = verifiedSession.access_token;
          refreshToken = verifiedSession.refresh_token;
          expiresIn = verifiedSession.expires_in;
          userId = verifiedSession.user.id;
          email = verifiedSession.user.email;
        }
      }

      if (!accessToken || !refreshToken) {
        if (isActive) {
          if (fromSignup) {
            setConfirmedWithoutSession(true);
            setTimeout(
              () => router.replace("/confirmation-inscription?email_confirmed=1"),
              1200
            );
            return;
          }
          setError("Lien invalide ou expire. Reessaie depuis ton dernier email.");
        }
        return;
      }

      if (!userId) {
        const config = getPublicSupabaseConfig();
        if (config) {
          const meResponse = await fetch(`${config.url}/auth/v1/user`, {
            headers: {
              apikey: config.key,
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (meResponse.ok) {
            const me = (await meResponse.json()) as { id?: string; email?: string };
            userId = me.id ?? userId;
            email = me.email ?? email;
          }
        }
      }

      if (!userId) {
        if (isActive) {
          if (fromSignup) {
            setConfirmedWithoutSession(true);
            setTimeout(
              () => router.replace("/confirmation-inscription?email_confirmed=1"),
              1200
            );
            return;
          }
          setError("Session invalide. Connecte-toi manuellement.");
        }
        return;
      }

      setStoredSession({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: Number.isFinite(expiresIn) ? expiresIn : 3600,
        token_type: tokenType,
        user: { id: userId, email },
      } as CallbackSession);

      if (!isActive) return;
      setDone(true);
      setTimeout(() => router.replace("/simulations?signup=confirmed"), 1300);
    }

    run();

    return () => {
      isActive = false;
    };
  }, [router]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl items-center px-6 py-10">
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Confirmation de compte
        </h1>
        <p className="mt-3 text-sm text-slate-600">{statusText}</p>
        {done || confirmedWithoutSession ? (
          <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Inscription confirmee.
            {done
              ? " Ton compte est actif."
              : " Ton email est valide. Connecte-toi pour acceder a ton espace."}
          </p>
        ) : null}
        <div className="mt-6">
          <Link
            href={done ? "/simulations" : "/connexion?signup=confirmed"}
            className="inline-flex rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            {done ? "Continuer vers les simulations" : "Aller a la connexion"}
          </Link>
        </div>
      </section>
    </main>
  );
}
