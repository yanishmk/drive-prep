export default function ConfidentialitePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Politique de confidentialite</h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-slate-700">
        <p>
          Nous collectons uniquement les donnees necessaires au service: email, informations de profil,
          progression aux examens et statut d abonnement.
        </p>
        <p>
          Les paiements sont traites par Stripe. Les donnees bancaires ne transitent pas ni ne sont stockees
          sur Drive-Prep.
        </p>
        <p>
          Les donnees sont utilisees pour fournir le service, prevenir la fraude et ameliorer l experience.
          Vous pouvez demander la suppression de votre compte a support@driveprep.ca.
        </p>
        <p>
          En utilisant la plateforme, vous acceptez cette politique. Derniere mise a jour: 3 mars 2026.
        </p>
      </div>
    </main>
  );
}
