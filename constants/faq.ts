import type { FaqItem } from "@/types/marketing";

/**
 * FAQ institucional (MARKETING-013 / faqView.php).
 * IDs estáveis para accordion e JSON-LD futuros.
 *
 * TODO(produto): revisar copy com marketing; itens 8–9 do legado
 * (“progresso” / “inovador”) estavam comentados e ficaram de fora.
 */

export const faqSectionMeta = {
  subtitle: "FAQ",
  title: "Método de Estudo Neurocientífico.",
  imageSrc: "/assets/images/faq/faq.png",
  imageAlt: "Ilustração da seção de perguntas frequentes",
} as const;

export const faqItems: FaqItem[] = [
  {
    id: "o-que-e-metodo",
    question: "O que é o Método de Estudo Neurocientífico?",
    answer:
      "É uma abordagem de aprendizado 100% online e autônoma, projetada para superar a curva do esquecimento e consolidar o conhecimento. O método utiliza princípios neurocientíficos para otimizar o aprendizado em menos tempo e com maior retenção.",
  },
  {
    id: "fundamentos-neurociencia",
    question: "Como o método é fundamentado na neurociência?",
    answer:
      "Ele se baseia em plasticidade cerebral (adaptabilidade do cérebro em desenvolvimento); ciclo da memória (aquisição, consolidação e evocação); emoção e aprendizagem (conexões emocionais com o conteúdo); e aprendizagem multissensorial (estímulo de diferentes sentidos).",
  },
  {
    id: "etapas-do-metodo",
    question: "Quais são as etapas do método?",
    answer:
      "Microlearning (unidades de até 15 minutos); repetição espaçada; gamificação; mapas mentais e flashcards; técnicas de memorização; e autoavaliação com metacognição.",
  },
  {
    id: "recursos-plataforma",
    question: "Quais recursos a plataforma oferece?",
    answer:
      "Interface intuitiva e gamificada; conteúdo multimídia e interativo; algoritmo de repetição espaçada; ferramentas de organização e memorização (mapas mentais e flashcards); e acompanhamento do progresso com feedback personalizado.",
  },
  {
    id: "beneficios",
    question: "Quais são os benefícios do método?",
    answer:
      "Aprendizagem mais eficiente e duradoura; maior motivação e engajamento; desenvolvimento de autonomia e metacognição; estudo flexível e personalizado; otimização do tempo e melhores resultados.",
  },
  {
    id: "quem-pode-usar",
    question: "Quem pode usar o método?",
    answer:
      "O método é voltado para crianças e adolescentes, adaptado a diferentes estilos de aprendizado e faixas etárias. É especialmente eficaz para jovens que buscam maior autonomia e resultados duradouros no estudo.",
  },
  {
    id: "acompanhamento-pais",
    question: "O acompanhamento dos pais é necessário?",
    answer:
      "Para crianças menores, o acompanhamento parental é recomendado para monitorar o progresso e garantir o melhor uso da plataforma. O portal do responsável mostra progresso, materiais, relatórios e conquistas em linguagem simples.",
  },
  {
    id: "planos-familia-escola",
    question: "Qual a diferença entre os planos familiares e o plano Escola?",
    answer:
      "Os planos Starter, Essencial e Premium são para famílias (limite de filhos e pacotes). O plano Escola cobre licenças por pacote, turmas e professores — ideal para escolas e redes. Veja detalhes em Preço e Planos.",
  },
  {
    id: "como-comecar",
    question: "Como começo a usar a Akili?",
    answer:
      "Famílias podem escolher um plano e seguir para o cadastro/checkout. Escolas falam conosco pelo Contato para ativação de licenças. Depois do login, o responsável acompanha os filhos no portal.",
  },
];

export const faqDefaultOpenId = faqItems[0]?.id;
