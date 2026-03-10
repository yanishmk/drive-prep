import Link from "next/link";
import { QuestionIllustrationView } from "@/components/permis/QuestionIllustration";
import { PRIORITY_SCENARIOS } from "@/lib/permis/priorityScenarios";
import { QUESTION_BANK } from "@/lib/permis/questionBank";

const PRIORITY_TRAINING_IDS = [
  "Q021",
  "Q026",
  "Q027",
  "Q031",
  "Q032",
  "Q033",
  "Q034",
  "Q035",
  "Q162",
  "Q163",
  "Q164",
  "Q165",
  "Q166",
  "Q174",
  "Q184",
] as const;

const PRIORITY_QUESTIONS = PRIORITY_TRAINING_IDS.map((id) => QUESTION_BANK.find((q) => q.id === id)).filter(
  (q): q is (typeof QUESTION_BANK)[number] => Boolean(q)
);

export default function PrioriteScenariosPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <main className="mx-auto w-full max-w-7xl px-6 pb-16 pt-10 sm:px-10">
        <header className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">
            Priorites de passage
          </p>
          <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight">
            Entrainement express: priorites et intersections
          </h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
            Cette section sert a pratiquer les cas de priorite les plus frequents (arret, cedez,
            virage, pietons, cyclistes, urgence) avec des illustrations et la bonne reponse.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/simulations"
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Passer un examen complet
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Retour accueil
            </Link>
          </div>
        </header>

        <section className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Scenarios de reference</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {PRIORITY_SCENARIOS.map((scenario) => (
              <article key={scenario.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="font-semibold">
                  Scenario {scenario.id}: {scenario.titre}
                </h3>
                <p className="mt-2 text-sm text-slate-700">
                  <span className="font-semibold">Scene: </span>
                  {scenario.sceneVueDessus}
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  <span className="font-semibold">Qui passe en premier: </span>
                  {scenario.passeEnPremier}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-5">
          {PRIORITY_QUESTIONS.map((question) => (
            <article
              key={question.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.04)]"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">{question.id}</span>
                <span className="rounded-full bg-teal-50 px-2 py-1 text-teal-700">{question.category}</span>
                <span className="rounded-full bg-amber-50 px-2 py-1 text-amber-700">{question.difficulty}</span>
              </div>

              <h2 className="text-xl font-semibold leading-tight">{question.question}</h2>

              <div className={`mt-4 grid gap-4 ${question.illustration ? "lg:grid-cols-2" : ""}`}>
                {question.illustration ? (
                  <QuestionIllustrationView illustration={question.illustration} revealSolution={false} />
                ) : null}

                <div className="grid gap-2">
                  {question.options.map((option, index) => {
                    const letters = ["A", "B", "C", "D"];
                    const isCorrect = index === question.correctOptionIndex;
                    return (
                      <div
                        key={`${question.id}-${index}`}
                        className={`flex rounded-xl border ${
                          isCorrect
                            ? "border-emerald-300 bg-emerald-50"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <span className="flex w-12 items-center justify-center bg-[#d8dccf] text-lg font-medium text-slate-700">
                          {letters[index]}
                        </span>
                        <span className="flex min-h-14 flex-1 items-center px-3 py-2 text-sm text-slate-700">
                          {option}
                        </span>
                      </div>
                    );
                  })}
                  <p className="mt-1 text-sm text-emerald-700">
                    Bonne reponse: {["A", "B", "C", "D"][question.correctOptionIndex]}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

