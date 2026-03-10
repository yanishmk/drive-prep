"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithGoogle, signInWithPassword } from "@/lib/supabase/auth";

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.2-.9 2.2-1.9 2.9l3 2.3c1.8-1.6 2.8-4 2.8-6.9 0-.7-.1-1.3-.2-2H12z"
      />
      <path
        fill="#34A853"
        d="M12 21c2.6 0 4.8-.9 6.4-2.4l-3-2.3c-.8.6-1.9 1-3.4 1-2.6 0-4.8-1.8-5.6-4.2l-3.1 2.4C4.8 18.9 8.1 21 12 21z"
      />
      <path
        fill="#4A90E2"
        d="M6.4 13.1c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9L3.3 6.9C2.5 8.3 2 9.9 2 11.2s.5 2.9 1.3 4.3l3.1-2.4z"
      />
      <path
        fill="#FBBC05"
        d="M12 5.1c1.4 0 2.7.5 3.7 1.4l2.8-2.8C16.8 2.1 14.6 1.2 12 1.2 8.1 1.2 4.8 3.3 3.3 6.9l3.1 2.4c.8-2.4 3-4.2 5.6-4.2z"
      />
    </svg>
  );
}

export default function ConnexionPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [signupConfirmed, setSignupConfirmed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setSignupConfirmed(params.get("signup") === "confirmed");
  }, []);

  const canSubmit = useMemo(() => {
    return email.trim().length > 5 && password.length >= 6;
  }, [email, password]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      setIsLoading(true);
      await signInWithPassword({ email, password });
      router.push("/simulations");
    } catch (err) {
      const nextError =
        err instanceof Error ? err.message : "Connexion impossible.";
      setError(nextError);
    } finally {
      setIsLoading(false);
    }
  }

  async function onGoogleLogin() {
    setError(null);
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (err) {
      const nextError =
        err instanceof Error ? err.message : "Connexion Google impossible.";
      setError(nextError);
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl items-center px-6 py-10">
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Connexion</h1>
        <p className="mt-2 text-sm text-slate-600">
          Connecte-toi pour continuer les simulations.
        </p>
        {signupConfirmed ? (
          <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Email confirme avec succes. Connecte-toi pour acceder a ton compte.
          </p>
        ) : null}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <button
            type="button"
            onClick={onGoogleLogin}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <GoogleIcon />
            <span>Continuer avec Google</span>
          </button>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-xs text-slate-500">ou</span>
            </div>
          </div>

          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Mot de passe
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
          </label>

          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit || isLoading}
            className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between text-sm">
          <Link href="/inscription" className="font-medium text-slate-700 underline">
            Creer un compte
          </Link>
          <Link
            href="/"
            className="rounded-full border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Retour accueil
          </Link>
        </div>
      </section>
    </main>
  );
}
