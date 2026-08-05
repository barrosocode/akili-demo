/**
 * Planos institucionais alinhados ao catálogo provisório da API
 * (`config/subscription_plans.php` / doc 14-planos-provisorios-demo).
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
  audience: "family" | "school";
};

export const plansPageMeta = {
  title: "Preço e Planos",
  subtitle: "Escolha o plano ideal para a sua família ou escola",
  intro:
    "Planos familiares para estudar em casa e plano Escola para turmas com licenças e acompanhamento pedagógico. Valores comerciais finais entram no checkout; esta página reflete o catálogo provisório da demo.",
} as const;

export const planItems: PlanItem[] = [
  {
    id: "starter",
    name: "Starter",
    priceLabel: "A partir de R$ 49/mês",
    description: "Ideal para começar com um filho e acompanhar o progresso básico.",
    audience: "family",
    features: [
      "1 filho",
      "1 pacote de conteúdo",
      "Progresso básico no portal",
      "Acesso ao app do aluno",
    ],
    ctaLabel: "Começar com Starter",
    ctaHref: "/checkout?plan=starter",
  },
  {
    id: "essencial",
    name: "Essencial",
    priceLabel: "A partir de R$ 79/mês",
    description: "Progresso e relatórios simples para até dois filhos.",
    audience: "family",
    features: [
      "Até 2 filhos",
      "Até 2 pacotes",
      "Relatórios pedagógicos",
      "Acompanhamento semanal",
    ],
    ctaLabel: "Assinar Essencial",
    ctaHref: "/checkout?plan=essencial",
  },
  {
    id: "premium",
    name: "Premium",
    priceLabel: "A partir de R$ 129/mês",
    description: "Pacotes familiares, gamificação e acompanhamento completo.",
    audience: "family",
    highlighted: true,
    features: [
      "Até 4 filhos",
      "Pacotes familiares ilimitados",
      "Gamificação (XP, missões, medalhas)",
      "Relatórios e próximos conteúdos",
    ],
    ctaLabel: "Assinar Premium",
    ctaHref: "/checkout?plan=premium",
  },
  {
    id: "escola",
    name: "Escola",
    priceLabel: "Sob consulta",
    description: "Licenças por pacote, turmas, professores e relatórios para a coordenação.",
    audience: "school",
    features: [
      "Licenças escolares com limite por pacote",
      "Turmas e professores",
      "Relatórios pedagógicos",
      "Gamificação no acompanhamento familiar",
    ],
    ctaLabel: "Falar com a Akili",
    ctaHref: "/contato",
  },
];
