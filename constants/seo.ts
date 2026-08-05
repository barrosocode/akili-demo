import type { Metadata } from "next";

import { siteConfig } from "@/constants/site";

/**
 * Metadata base + helpers por página (MARKETING-009 / 051 / 055 / 056).
 */

export const marketingTitleTemplate = `%s | ${siteConfig.brand.name}` as const;

export const marketingDefaultTitle =
  `${siteConfig.brand.name} — aprendizado com neurociência` as const;

export const marketingDefaultDescription = siteConfig.brand.tagline;

export const marketingMetadataBase = new URL(siteConfig.siteUrl);

export const marketingOgImage = {
  url: siteConfig.assets.logoPositive.src,
  width: siteConfig.assets.logoPositive.width,
  height: siteConfig.assets.logoPositive.height,
  alt: siteConfig.brand.name,
} as const;

export const marketingIcons: NonNullable<Metadata["icons"]> = {
  icon: [
    { url: siteConfig.assets.favicons.faviconIco },
    {
      url: siteConfig.assets.favicons.icon16,
      sizes: "16x16",
      type: "image/png",
    },
    {
      url: siteConfig.assets.favicons.icon32,
      sizes: "32x32",
      type: "image/png",
    },
    {
      url: siteConfig.assets.favicons.icon96,
      sizes: "96x96",
      type: "image/png",
    },
    {
      url: siteConfig.assets.favicons.android192,
      sizes: "192x192",
      type: "image/png",
    },
  ],
  apple: [
    {
      url: siteConfig.assets.favicons.apple180,
      sizes: "180x180",
      type: "image/png",
    },
  ],
};

/** Canonical absoluto sem trailing slash (exceto raiz). */
export function canonical(path: string): string {
  if (!path || path === "/") {
    return siteConfig.siteUrl;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.siteUrl}${normalized.replace(/\/$/, "")}`;
}

type PageSeoInput = {
  title: string;
  description: string;
  path: string;
};

export function buildPageMetadata({
  title,
  description,
  path,
}: PageSeoInput): Metadata {
  const url = canonical(path);

  return {
    metadataBase: marketingMetadataBase,
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: siteConfig.brand.name,
      title,
      description,
      url,
      images: [marketingOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [marketingOgImage.url],
    },
  };
}

export const marketingPageSeo = {
  home: {
    title: marketingDefaultTitle,
    description: marketingDefaultDescription,
    path: "/",
  },
  sobreNos: {
    title: "Sobre Nós",
    description:
      "Conheça a Akili Educ: plataforma educacional baseada em neurociência para tornar o aprendizado mais eficiente e significativo.",
    path: "/sobre-nos",
  },
  series: {
    title: "Séries",
    description:
      "Trilhas de aprendizado por etapa escolar com microlearning, repetição espaçada e acompanhamento do progresso.",
    path: "/series",
  },
  blog: {
    title: "Blog",
    description:
      "Publicações sobre estudo, neurociência aplicada e acompanhamento familiar na Akili Educ.",
    path: "/blog",
  },
  faq: {
    title: "FAQ",
    description:
      "Perguntas frequentes sobre o Método de Estudo Neurocientífico e a plataforma Akili Educ.",
    path: "/faq",
  },
  contato: {
    title: "Contato",
    description: "Fale com a equipe Akili Educ por e-mail ou telefone.",
    path: "/contato",
  },
  cadastro: {
    title: "Cadastre-se",
    description:
      "Comece na Akili Educ: cadastre-se e leve o método neurocientífico para a rotina de estudos da sua família.",
    path: "/cadastro",
  },
  newsletter: {
    title: "Newsletter",
    description:
      "Receba novidades e dicas de estudo da Akili Educ na sua caixa de entrada.",
    path: "/newsletter",
  },
  precoEPlanos: {
    title: "Preço e Planos",
    description:
      "Conheça os planos da Akili Educ e escolha a opção ideal para a sua família.",
    path: "/preco-e-planos",
  },
} as const;

export const marketingLayoutMetadata: Metadata = {
  metadataBase: marketingMetadataBase,
  title: {
    default: marketingDefaultTitle,
    template: marketingTitleTemplate,
  },
  description: marketingDefaultDescription,
  applicationName: siteConfig.brand.name,
  authors: [{ name: siteConfig.brand.name }],
  robots: {
    index: true,
    follow: true,
  },
  icons: marketingIcons,
  manifest: siteConfig.assets.favicons.manifest,
  alternates: {
    canonical: canonical("/"),
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: siteConfig.brand.name,
    title: marketingDefaultTitle,
    description: marketingDefaultDescription,
    url: siteConfig.siteUrl,
    images: [marketingOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: marketingDefaultTitle,
    description: marketingDefaultDescription,
    images: [marketingOgImage.url],
  },
};
