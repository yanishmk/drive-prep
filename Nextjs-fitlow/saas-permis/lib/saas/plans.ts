export type PlanCode = "basic" | "pro";

export type PlanConfig = {
  code: PlanCode;
  name: string;
  priceCents: number;
  priceLabel: string;
  durationDays: number;
  examsIncluded: number;
  strictMode: boolean;
  features: string[];
  excluded: string[];
};

export const PLAN_CONFIG: Record<PlanCode, PlanConfig> = {
  basic: {
    code: "basic",
    name: "BASIC",
    priceCents: 1499,
    priceLabel: "14.99$",
    durationDays: 10,
    examsIncluded: 10,
    strictMode: false,
    features: [
      "Acces 10 jours",
      "10 examens complets (format reel 3 sections)",
      "28 questions par examen",
      "Score global",
      "Explications simples",
      "Mode entrainement",
    ],
    excluded: [
      "Pas de statistiques avancees",
      "Pas de priorites illustrees",
      "Pas de mode strict",
    ],
  },
  pro: {
    code: "pro",
    name: "PRO",
    priceCents: 2999,
    priceLabel: "29.99$",
    durationDays: 30,
    examsIncluded: 20,
    strictMode: true,
    features: [
      "Acces 30 jours",
      "20 examens complets",
      "Mode strict (simulation reelle)",
      "Score par section",
      "Analyse detaillee des erreurs",
      "Statistiques personnelles",
      "Priorites illustrees",
      "Recommandations personnalisees",
    ],
    excluded: [],
  },
};

export function isPlanCode(value: string | null | undefined): value is PlanCode {
  return value === "basic" || value === "pro";
}

export function getPlanConfig(code: PlanCode): PlanConfig {
  return PLAN_CONFIG[code];
}
