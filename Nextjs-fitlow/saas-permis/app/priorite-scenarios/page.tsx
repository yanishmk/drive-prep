import { PRIORITY_SCENARIOS } from "@/lib/permis/priorityScenarios";

export default function PrioriteScenariosPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-10 sm:px-10">
        <header className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">
            Scenarios pedagogiques
          </p>
          <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight">
            10 scenarios de priorite a illustrer
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Ces scenes sont redigees pour produire des visuels vue du dessus et
            entrainer les candidats aux decisions de priorite les plus frequentes.
          </p>
        </header>

        <section className="grid gap-5">
          {PRIORITY_SCENARIOS.map((scenario) => (
            <article
              key={scenario.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.04)]"
            >
              <h2 className="font-display text-xl font-semibold tracking-tight">
                Scenario {scenario.id}: {scenario.titre}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                <span className="font-semibold">Scene (vue du dessus): </span>
                {scenario.sceneVueDessus}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                <span className="font-semibold">Positions des voitures: </span>
                {scenario.positionsVoitures}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                <span className="font-semibold">Direction: </span>
                {scenario.directions}
              </p>
              <p className="mt-2 text-sm leading-6 text-teal-700">
                <span className="font-semibold">Passe en premier: </span>
                {scenario.passeEnPremier}
              </p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
