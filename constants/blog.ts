import type { BlogPostCard } from "@/types/marketing";

/**
 * Posts estáticos do blog institucional (MARKETING-014).
 * Placeholders MVP até CMS — copy PT-BR Akili (não template Kiddino).
 *
 * TODO(produto): substituir por conteúdo real / CMS quando disponível.
 */

export const blogSectionMeta = {
  title: "Publicações Recentes",
  subtitle:
    "Dicas de estudo, neurociência aplicada e acompanhamento familiar — para apoiar a jornada de aprendizado do seu filho.",
  ctaLabel: "Ver mais publicações",
  ctaHref: "/blog",
} as const;

export const blogPosts: BlogPostCard[] = [
  {
    title: "Como a repetição espaçada melhora a retenção",
    excerpt:
      "Entenda por que revisar em intervalos certos ajuda o cérebro a consolidar o que foi estudado — e como a Akili aplica isso na prática.",
    href: "/blog/repeticao-espacada-retencao",
    imageSrc: "/assets/img/blog/blog5-1.jpg",
    imageAlt: "Estudante revisando conteúdo",
    dateLabel: "12 mar 2026",
  },
  {
    title: "Microlearning: estudar em blocos curtos funciona?",
    excerpt:
      "Unidades de até 15 minutos podem aumentar o foco e reduzir a sobrecarga cognitiva. Veja quando vale a pena usar esse formato.",
    href: "/blog/microlearning-blocos-curtos",
    imageSrc: "/assets/img/blog/blog5-2.png",
    imageAlt: "Ilustração de estudo em blocos curtos",
    dateLabel: "28 fev 2026",
  },
  {
    title: "Como acompanhar o progresso do seu filho sem pressão",
    excerpt:
      "Relatórios e feedback ajudam a família a apoiar o estudo com equilíbrio — valorizando autonomia e bem-estar.",
    href: "/blog/acompanhar-progresso-sem-pressao",
    imageSrc: "/assets/img/blog/blog5-3.jpg",
    imageAlt: "Família acompanhando o aprendizado",
    dateLabel: "10 fev 2026",
  },
];
