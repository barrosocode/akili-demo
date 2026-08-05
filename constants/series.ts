/**
 * Conteúdo editorial da página Séries (MARKETING-044).
 * TODO(produto): alinhar séries/oferta real do catálogo.
 */

export type SeriesItem = {
  id: string;
  title: string;
  description: string;
};

export const seriesPageMeta = {
  title: "Séries",
  subtitle: "Trilhas de aprendizado por etapa escolar",
  intro:
    "As séries da Akili Educ organizam o conteúdo em jornadas claras — com microlearning, repetição espaçada e acompanhamento do progresso.",
  ctaLabel: "Ver planos",
  ctaHref: "/preco-e-planos",
} as const;

export const seriesItems: SeriesItem[] = [
  {
    id: "anos-iniciais",
    title: "Anos iniciais",
    description:
      "Fundamentos com blocos curtos, gamificação leve e apoio familiar para criar o hábito de estudar com autonomia.",
  },
  {
    id: "anos-finais",
    title: "Anos finais",
    description:
      "Consolidação de conteúdos com repetição espaçada, mapas mentais e prática guiada para retenção de longo prazo.",
  },
  {
    id: "ensino-medio",
    title: "Ensino médio",
    description:
      "Preparação com foco em eficiência, metacognição e organização do estudo — sem sobrecarga desnecessária.",
  },
];
