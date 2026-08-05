/**
 * Planos MVP (MARKETING-050).
 * TODO(produto): preços, benefícios e nomes oficiais.
 */

export type PlanItem = {
  id: string;
  name: string;
  priceLabel: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  ctaLabel: string;
  ctaHref: string;
};

export const plansPageMeta = {
  title: "Preço e Planos",
  subtitle: "Escolha o plano ideal para a sua família",
  intro:
    "Acesso à plataforma Akili Educ com método neurocientífico, acompanhamento de progresso e experiência pensada para alunos típicos e atípicos.",
} as const;

export const planItems: PlanItem[] = [
  {
    id: "mensal",
    name: "Plano Mensal",
    priceLabel: "Consulte no checkout",
    description: "Flexibilidade para experimentar a plataforma mês a mês.",
    features: [
      "Acesso completo ao método",
      "Acompanhamento de progresso",
      "Conteúdo multimídia e quizzes",
    ],
    ctaLabel: "Assinar mensal",
    ctaHref: "/checkout",
  },
  {
    id: "anual",
    name: "Plano Anual",
    priceLabel: "Melhor custo-benefício",
    description: "Ideal para famílias que querem consistência ao longo do ano letivo.",
    features: [
      "Tudo do plano mensal",
      "Economia no período anual",
      "Prioridade em novidades de conteúdo",
    ],
    highlighted: true,
    ctaLabel: "Assinar anual",
    ctaHref: "/checkout",
  },
];
