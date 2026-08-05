import type { BlogPost, BlogPostCard } from "@/types/marketing";

/**
 * Posts estáticos do blog institucional (MARKETING-014).
 * Conteúdo completo para `/blog/[slug]` na demo.
 */

export const blogSectionMeta = {
  title: "Publicações Recentes",
  subtitle:
    "Dicas de estudo, neurociência aplicada e acompanhamento familiar — para apoiar a jornada de aprendizado do seu filho.",
  ctaLabel: "Ver mais publicações",
  ctaHref: "/blog",
} as const;

export const blogPostDetails: BlogPost[] = [
  {
    slug: "repeticao-espacada-retencao",
    title: "Como a repetição espaçada melhora a retenção",
    excerpt:
      "Entenda por que revisar em intervalos certos ajuda o cérebro a consolidar o que foi estudado — e como a Akili aplica isso na prática.",
    href: "/blog/repeticao-espacada-retencao",
    imageSrc: "/assets/img/blog/blog5-1.jpg",
    imageAlt: "Estudante revisando conteúdo",
    dateLabel: "12 mar 2026",
    dateIso: "2026-03-12",
    body: [
      "A curva do esquecimento mostra que, sem revisão, boa parte do que estudamos se perde em poucos dias. A repetição espaçada combate isso com revisões em intervalos crescentes.",
      "Na Akili, as atividades voltam em momentos planejados: o aluno revisa o essencial sem sobrecarga, e o responsável acompanha o ritmo no portal.",
      "Na prática: blocos curtos, feedback imediato e um próximo conteúdo claro — o que aumenta a chance de o hábito se manter ao longo da semana.",
    ],
  },
  {
    slug: "microlearning-blocos-curtos",
    title: "Microlearning: estudar em blocos curtos funciona?",
    excerpt:
      "Unidades de até 15 minutos podem aumentar o foco e reduzir a sobrecarga cognitiva. Veja quando vale a pena usar esse formato.",
    href: "/blog/microlearning-blocos-curtos",
    imageSrc: "/assets/img/blog/blog5-2.png",
    imageAlt: "Ilustração de estudo em blocos curtos",
    dateLabel: "28 fev 2026",
    dateIso: "2026-02-28",
    body: [
      "Crianças e adolescentes mantêm melhor a atenção em sessões curtas e bem definidas. O microlearning organiza o conteúdo em unidades de até 15 minutos.",
      "Isso não substitui projetos mais longos — complementa. A Akili usa microlearning para conquistar consistência diária e liberar desafios maiores quando o aluno estiver pronto.",
      "Dica para a família: combine o estudo com um ritual simples (após o lanche, por exemplo) e celebre a conclusão do bloco, não a duração.",
    ],
  },
  {
    slug: "acompanhar-progresso-sem-pressao",
    title: "Como acompanhar o progresso do seu filho sem pressão",
    excerpt:
      "Relatórios e feedback ajudam a família a apoiar o estudo com equilíbrio — valorizando autonomia e bem-estar.",
    href: "/blog/acompanhar-progresso-sem-pressao",
    imageSrc: "/assets/img/blog/blog5-3.jpg",
    imageAlt: "Família acompanhando o aprendizado",
    dateLabel: "10 fev 2026",
    dateIso: "2026-02-10",
    body: [
      "Acompanhar não é cobrar nota o tempo todo. É entender o ritmo, celebrar avanços e oferecer apoio quando o desempenho pede reforço.",
      "No portal do responsável você vê progresso por disciplina, materiais pendentes, streak de estudo e relatórios em linguagem simples — sem rankings entre crianças.",
      "Use as conquistas e missões como conversa positiva: “o que você aprendeu hoje?” funciona melhor do que “por que não terminou tudo?”.",
    ],
  },
];

export const blogPosts: BlogPostCard[] = blogPostDetails.map(
  ({ body: _body, dateIso: _dateIso, slug: _slug, ...card }) => card
);

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPostDetails.find((post) => post.slug === slug);
}
