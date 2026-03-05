export default function RemboursementPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Politique de remboursement</h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-slate-700">
        <p>
          Vous pouvez demander un remboursement dans les 7 jours suivant le paiement si vous n avez pas
          utilise de maniere significative la plateforme.
        </p>
        <p>
          Les demandes sont traitees manuellement a support@driveprep.ca avec votre email de compte
          et la date de transaction.
        </p>
        <p>
          En cas d abus (multiples remboursements, usage intensif avant demande), la demande peut etre
          refusee.
        </p>
        <p>Derniere mise a jour: 3 mars 2026.</p>
      </div>
    </main>
  );
}
