"use client";

import Link from "next/link";

export default function ConfirmationInscriptionPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl items-center px-6 py-10">
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Inscription confirmee
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Ton email a bien ete confirme. Pour des raisons de securite, connecte-toi maintenant
          pour ouvrir ta session.
        </p>
        <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Confirmation reussie.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/connexion?signup=confirmed"
            className="inline-flex rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Se connecter
          </Link>
          <Link
            href="/"
            className="inline-flex rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Retour accueil
          </Link>
        </div>
      </section>
    </main>
  );
}
