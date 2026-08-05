/**
 * Conteúdo editorial da página Séries — alinhado às etapas do catálogo
 * (Alfabetização + Fundamental 1º–9º + Médio).
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
    "A Akili organiza o conteúdo por etapa escolar — da alfabetização ao ensino médio — com microlearning, repetição espaçada e acompanhamento do progresso no portal da família.",
  ctaLabel: "Ver planos",
  ctaHref: "/preco-e-planos",
} as const;

export const seriesItems: SeriesItem[] = [
  {
    id: "alfabetizacao",
    title: "Alfabetização",
    description:
      "Consciência fonológica, sílabas e leitura inicial em blocos curtos — com apoio familiar e feedback positivo.",
  },
  {
    id: "anos-iniciais",
    title: "Anos iniciais (1º ao 5º)",
    description:
      "Fundamentos de ciências, língua e raciocínio com gamificação leve e rotina de estudo diária.",
  },
  {
    id: "anos-finais",
    title: "Anos finais (6º ao 9º)",
    description:
      "Consolidação com repetição espaçada, mapas mentais e prática guiada para retenção de longo prazo.",
  },
  {
    id: "ensino-medio",
    title: "Ensino médio",
    description:
      "Preparação com foco em eficiência, metacognição e organização do estudo — sem sobrecarga desnecessária.",
  },
];
