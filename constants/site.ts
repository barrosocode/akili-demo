/**
 * Constantes institucionais do site marketing (MARKETING-006 / SPEC-001).
 *
 * Contatos de demonstração — substituir pelos oficiais em produção.
 * Não colocar secrets neste arquivo.
 */

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const siteConfig = {
  brand: {
    name: "Akili Educ",
    shortName: "Akili",
    /** Resumo institucional (footer / SEO). */
    tagline:
      "Plataforma educacional baseada nas neurociências para tornar o aprendizado mais eficiente, acessível e significativo.",
    about:
      "A Akili é uma plataforma educacional baseada nas neurociências e criada para tornar o aprendizado mais eficiente, acessível e significativo para todas as crianças — típicas e atípicas.",
  },
  siteUrl,
  contact: {
    email: "contato@akilieduc.com.br",
    phoneDisplay: "(11) 3456-7890",
    phoneTel: "+551134567890",
  },
  social: {
    instagram: "https://www.instagram.com/akilieduc",
    facebook: "https://www.facebook.com/akilieduc",
    x: "https://x.com/akilieduc",
    linkedin: "https://www.linkedin.com/company/akilieduc",
  },
  assets: {
    logoPositive: {
      src: "/assets/images/logo-akili-positivo.png",
      width: 300,
      height: 70,
    },
    logoNegative: {
      src: "/assets/images/logo-akilieduc-negativo.png",
      width: 235,
      height: 55,
    },
    logoFull: "/assets/images/logo-akilieduc.png",
    favicons: {
      icon16: "/assets/favicons/favicon-16x16.png",
      icon32: "/assets/favicons/favicon-32x32.png",
      icon96: "/assets/favicons/favicon-96x96.png",
      apple180: "/assets/favicons/apple-icon-180x180.png",
      android192: "/assets/favicons/android-icon-192x192.png",
      faviconIco: "/assets/favicons/favicon.ico",
      manifest: "/assets/favicons/manifest.json",
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
