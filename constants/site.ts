/**
 * Constantes institucionais do site marketing (MARKETING-006 / SPEC-001).
 *
 * TODO(produto): substituir placeholders de contato e redes pelos valores oficiais.
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
    /** TODO(produto): e-mail oficial */
    email: "contato@akilieduc.com.br",
    /** TODO(produto): telefone oficial (exibição) */
    phoneDisplay: "(11) 0000-0000",
    /** TODO(produto): telefone para tel: (somente dígitos / +) */
    phoneTel: "+5511000000000",
  },
  social: {
    /** TODO(produto): URLs oficiais */
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    x: "https://x.com/",
    linkedin: "https://www.linkedin.com/",
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
