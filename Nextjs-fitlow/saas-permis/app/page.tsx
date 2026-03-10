import Image from "next/image";
import Link from "next/link";
import { PlanCheckoutButton } from "@/components/saas/PlanCheckoutButton";
import { EXAMS } from "@/lib/permis/exams";
import { QUESTION_STATS } from "@/lib/permis/questionBank";
import { PLAN_CONFIG, type PlanCode } from "@/lib/saas/plans";

const benefits = [
  "Simulation chronometree proche du vrai examen theorique.",
  "Questions ciblees sur les notions les plus frequentes de la SAAQ.",
  "Correction detaillee pour progresser vite et eviter les erreurs repetees.",
];

const faq = [
  {
    q: "Puis-je tester avant de payer?",
    a: "Oui. Un examen gratuit est disponible pour essayer la plateforme.",
  },
  {
    q: "Les questions sont-elles identiques a la SAAQ?",
    a: "Non. Elles sont originales, mais redigees dans un style tres proche de l'examen officiel.",
  },
  {
    q: "Combien de temps dure un examen?",
    a: "Chaque simulation dure 25 minutes en mode chronometre.",
  },
  {
    q: "Quel score faut-il viser?",
    a: "L'objectif de reussite est de 80% ou plus.",
  },
];

function PriceCard({
  title,
  ribbon,
  price,
  access,
  subtitle,
  items,
  excluded,
  recommended,
  ctaLabel,
  planCode,
}: {
  title: string;
  ribbon: string;
  price: string;
  access: string;
  subtitle?: string;
  items: string[];
  excluded?: string[];
  recommended?: boolean;
  ctaLabel?: string;
  planCode: PlanCode;
}) {
  return (
    <article
      className={`relative overflow-hidden rounded-2xl border shadow-[0_14px_34px_rgba(15,23,42,0.12)] ${
        recommended ? "border-emerald-500" : "border-emerald-200"
      }`}
    >
      <div className="bg-emerald-600 px-6 py-8 text-center text-white">
        <h3 className="font-display text-4xl font-semibold tracking-tight">{title}</h3>
      </div>

      <div
        className={`absolute right-[-64px] top-6 rotate-45 px-16 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-white ${
          recommended ? "bg-amber-500" : "bg-emerald-500"
        }`}
      >
        {ribbon}
      </div>

      <div className="bg-white p-6">
        <p className="text-center text-5xl font-extrabold tracking-tight text-slate-800">{price}</p>
        <p className="mt-2 text-center text-sm font-medium text-slate-600">{access}</p>
        {subtitle ? <p className="mt-1 text-center text-xs text-slate-500">{subtitle}</p> : null}

        <div className="mt-6 space-y-3">
          {items.map((line) => (
            <div key={line} className="border-t border-slate-200 pt-3 text-sm text-slate-700">
              {line}
            </div>
          ))}
          {(excluded ?? []).map((line) => (
            <div key={line} className="border-t border-slate-200 pt-3 text-sm text-slate-500">
              {line}
            </div>
          ))}
        </div>

        <PlanCheckoutButton
          planCode={planCode}
          recommended={recommended}
          label={ctaLabel ?? "Choisir ce plan"}
        />
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.10),transparent_42%)]" />

      <main className="relative w-full px-4 pb-16 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <header className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/brand/drive-prep-logo.svg"
              alt="Drive-Prep logo"
              width={44}
              height={44}
              className="h-11 w-11 rounded-full border border-slate-200 bg-white object-cover"
              priority
            />
            <p className="font-display text-lg font-semibold tracking-tight">Drive-Prep</p>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/simulations"
              className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              Simulations
            </Link>
            <span className="mx-1 h-6 w-px bg-slate-200" />
            <Link
              href="/connexion"
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Connexion
            </Link>
            <Link
              href="/inscription"
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              Inscription
            </Link>
          </div>
        </header>

        <section className="py-16 lg:py-20">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Preparation theorique SAAQ
          </p>
          <h1 className="font-display mx-auto mt-4 max-w-5xl text-center text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Reussis ton examen du premier coup.
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-center text-lg text-slate-600">
            Une methode simple, claire et professionnelle pour t&apos;entrainer efficacement avant le jour J.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/simulations"
              className="rounded-full bg-emerald-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              Commencer maintenant
            </Link>
            <a
              href="#plans"
              className="rounded-full border border-emerald-200 bg-white px-8 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              Voir les plans
            </a>
          </div>

          <div className="mx-auto mt-8 grid w-full max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-slate-500">Questions</p>
              <p className="mt-1 text-2xl font-bold text-emerald-700">{QUESTION_STATS.total}</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-slate-500">Examens</p>
              <p className="mt-1 text-2xl font-bold text-emerald-700">{EXAMS.length}</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-slate-500">Duree</p>
              <p className="mt-1 text-2xl font-bold text-emerald-700">25 min</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-slate-500">Seuil</p>
              <p className="mt-1 text-2xl font-bold text-emerald-700">80%</p>
            </div>
          </div>
        </section>

        <section
          id="plans"
          className="mt-16 rounded-3xl border border-emerald-100 bg-emerald-50/50 p-6 sm:p-8 lg:mt-20"
        >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-4xl font-semibold tracking-tight">Choisis ton plan d entrainement</h2>
              <p className="mt-2 text-slate-600">
                Deux offres claires pour reussir plus vite, sans perdre de temps.
              </p>
            </div>
            <p className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              🔒 Paiement securise - Activation immediate
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <PriceCard
              title="Basic 🚗"
              ribbon="Examen bientot"
              price={PLAN_CONFIG.basic.priceLabel}
              access="Acces 10 jours"
              subtitle="Ideal si ton examen est dans les prochains jours."
              items={[
                "✅ 10 examens complets (format reel)",
                "✅ 28 questions par examen",
                "✅ Score global immediat",
                "✅ Explications claires et directes",
                "✅ Mode entrainement flexible",
              ]}
              excluded={["❌ Pas de statistiques personnelles", "❌ Pas de mode strict"]}
              ctaLabel="Demarrer avec Basic"
              planCode="basic"
            />

            <PriceCard
              title="Pro ⭐"
              ribbon="Le plus choisi"
              price={PLAN_CONFIG.pro.priceLabel}
              access="Acces 30 jours"
              subtitle="Le plan complet pour maximiser tes chances de reussite."
              items={[
                "✅ 20 examens complets",
                "✅ Mode strict (simulation reelle)",
                "✅ Score detaille par section",
                "✅ Analyse complete des erreurs",
                "✅ Statistiques personnelles",
                "✅ Recommandations de progression",
              ]}
              recommended={true}
              ctaLabel="Choisir Pro maintenant"
              planCode="pro"
            />
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:mt-20">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight">Pourquoi choisir nos examens</h2>
              <p className="mt-2 text-sm text-slate-600">
                Un parcours clair pour te preparer efficacement et arriver confiant le jour de l examen.
              </p>
              <ul className="mt-5 grid gap-3 text-sm text-slate-700">
                {benefits.map((item) => (
                  <li key={`${item}-proof`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <span className="mr-2 text-emerald-600">✨</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-display text-3xl font-semibold tracking-tight">FAQ</h3>
              <p className="mt-2 text-sm text-slate-600">Les reponses aux questions les plus frequentes.</p>
              <div className="mt-6 grid gap-4">
                {faq.map((item) => (
                  <details key={item.q} className="group rounded-2xl border border-slate-200 bg-white p-5">
                    <summary className="cursor-pointer list-none text-base font-semibold text-slate-900">
                      <span className="flex items-center justify-between gap-4">
                        {item.q}
                        <span className="text-slate-400 transition group-open:rotate-45">+</span>
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-20 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p>Drive-Prep - Plateforme de pratique theorique pour le permis de conduire au Quebec.</p>
            <nav className="flex flex-wrap items-center gap-3 text-slate-600">
              <Link href="/cgu" className="hover:underline">
                CGU
              </Link>
              <Link href="/confidentialite" className="hover:underline">
                Confidentialite
              </Link>
              <Link href="/remboursement" className="hover:underline">
                Remboursement
              </Link>
              <a href="mailto:support@driveprep.ca" className="hover:underline">
                Support
              </a>
            </nav>
          </div>
        </footer>
      </main>
    </div>
  );
}
