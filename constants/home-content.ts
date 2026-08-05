import { authLinks } from "@/constants/navigation";
import type {
  AboutSectionContent,
  HomeHeroContent,
  StudyMethodContent,
} from "@/types/marketing";

/**
 * Conteúdo tipado da home institucional (MARKETING-008).
 *
 * TODO(produto): revisar copy com marketing — valores abaixo são MVP
 * derivados da identidade Akili (não do template Kiddino).
 * No legado, textos vinham de CMS (`$cntHero`, `$cntAPlataforma`, etc.).
 */

export const homeHeroContent: HomeHeroContent = {
  title: "Aprendizado eficiente com neurociência",
  body: "A Akili Educ ajuda crianças e adolescentes a estudar com mais retenção, autonomia e engajamento — em uma plataforma pensada para alunos típicos e atípicos.",
  ctaLabel: "Cadastre-se",
  ctaHref: authLinks.register.href,
  backgroundSrc: "/assets/img/bg/slide-01.jpg",
};

export const homePlatformContent: AboutSectionContent = {
  subtitle: "A Plataforma",
  title: "Estudo online baseado na ciência do aprendizado",
  body: "Unidades curtas, repetição espaçada, gamificação e ferramentas de memorização em uma experiência intuitiva — para consolidar o conhecimento com menos tempo e mais significado.",
  imageSrc: "/assets/images/sobre/a-plataforma.png",
  imageAlt: "A Plataforma Akili Educ",
};

export const homeAboutContent: AboutSectionContent = {
  subtitle: "Sobre Nós",
  title: "Feita para tornar o aprendizado acessível e significativo",
  body: "A Akili Educ nasceu para apoiar famílias e estudantes com um método neurocientífico, flexível e acolhedor — valorizando diferentes estilos de aprendizado e o acompanhamento consciente do progresso.",
  imageSrc: "/assets/images/sobre/sobre-nos.png",
  imageAlt: "Sobre a Akili Educ",
};

export const homeStudyMethodContent: StudyMethodContent = {
  methodTitle: "Método de Estudo Neurocientífico",
  methodBody:
    "Uma abordagem 100% online e autônoma, projetada para superar a curva do esquecimento e consolidar o conhecimento com princípios de plasticidade cerebral, ciclo da memória e aprendizagem multissensorial.",
  stagesTitle: "Etapas do método",
  stages: [
    {
      id: "microlearning",
      title: "Microlearning",
      description:
        "Unidades curtas e objetivas, com vídeos, textos e quizzes em até 15 minutos.",
      imageSrc: "/assets/images/etapas-do-metodo/microlearning.png",
      imageAlt: "Microlearning",
    },
    {
      id: "repeticao-espacada",
      title: "Repetição espaçada",
      description:
        "Reintrodução estratégica de conteúdos para reforçar a memória de longo prazo.",
      imageSrc: "/assets/images/etapas-do-metodo/repeticao-espacada.png",
      imageAlt: "Repetição espaçada",
    },
    {
      id: "gamificacao",
      title: "Gamificação",
      description:
        "Pontos, desafios e elementos de jogo para motivar e engajar o estudante.",
      imageSrc: "/assets/images/etapas-do-metodo/gameficacao.png",
      imageAlt: "Gamificação",
    },
    {
      id: "flash-cards",
      title: "Mapas mentais e flashcards",
      description:
        "Ferramentas para organizar informações e facilitar a memorização.",
      imageSrc: "/assets/images/etapas-do-metodo/flash-cards.png",
      imageAlt: "Flashcards",
    },
    {
      id: "tecnicas-memorizacao",
      title: "Técnicas de memorização",
      description:
        "Mnemônicos, associações e storytelling para potencializar a retenção.",
      imageSrc: "/assets/images/etapas-do-metodo/tecnicas-memorizacao.png",
      imageAlt: "Técnicas de memorização",
    },
    {
      id: "auto-avaliacao",
      title: "Autoavaliação e metacognição",
      description:
        "Atividades para refletir sobre o aprendizado e desenvolver autonomia.",
      imageSrc: "/assets/images/etapas-do-metodo/auto-avaliacao.png",
      imageAlt: "Autoavaliação",
    },
  ],
};

export const homeCtaContent = {
  title: "Pronto para começar?",
  body: "Cadastre-se e leve o método de estudo neurocientífico da Akili Educ para a rotina da sua família.",
  ctaLabel: "Cadastre-se agora",
  ctaHref: authLinks.register.href,
} as const;

export const homeContent = {
  hero: homeHeroContent,
  platform: homePlatformContent,
  about: homeAboutContent,
  studyMethod: homeStudyMethodContent,
  cta: homeCtaContent,
} as const;
