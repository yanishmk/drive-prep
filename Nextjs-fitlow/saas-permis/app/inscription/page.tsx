"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUpWithProfile } from "@/lib/supabase/auth";

export default function InscriptionPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return (
      firstName.trim().length >= 2 &&
      lastName.trim().length >= 2 &&
      email.trim().length > 5 &&
      password.length >= 6 &&
      confirmPassword.length >= 6 &&
      acceptTerms
    );
  }, [acceptTerms, confirmPassword, email, firstName, lastName, password]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setConfirmationEmail(null);

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setIsLoading(true);
      const result = await signUpWithProfile({
        email,
        password,
        profile: { firstName, lastName, phone, birthDate, city },
      });

      if (result.requiresEmailConfirmation) {
        const normalizedEmail = email.trim().toLowerCase();
        setConfirmationEmail(normalizedEmail);
        setMessage(
          "Inscription reussie. Un email de confirmation a ete envoye. Clique le lien pour activer ton compte."
        );
        return;
      }

      router.push("/simulations");
    } catch (err) {
      const nextError =
        err instanceof Error ? err.message : "Impossible de creer le compte.";
      setError(nextError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-6 py-10">
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Inscription</h1>
        <p className="mt-2 text-sm text-slate-600">
          Cree ton compte pour acceder aux simulations.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Prenom
              <input
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Nom
              <input
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              />
            </label>
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

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Telephone (optionnel)
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Date de naissance (optionnel)
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Ville (optionnel)
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
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
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Confirmer mot de passe
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              />
            </label>
          </div>

          <label className="flex items-start gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1"
            />
            <span>J accepte les conditions d utilisation.</span>
          </label>

          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          {message ? (
            <div className="rounded-xl border border-teal-200 bg-teal-50 px-3 py-3 text-sm text-teal-800">
              <p className="font-semibold">{message}</p>
              {confirmationEmail ? (
                <ul className="mt-2 space-y-1 text-xs text-teal-900">
                  <li>Email: {confirmationEmail}</li>
                  <li>Verifie aussi le dossier spam/courrier indesirable.</li>
                  <li>Apres confirmation, tu seras redirige vers le site.</li>
                </ul>
              ) : null}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit || isLoading}
            className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isLoading ? "Creation..." : "Creer mon compte"}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between text-sm">
          <Link href="/connexion" className="font-medium text-slate-700 underline">
            J ai deja un compte
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
