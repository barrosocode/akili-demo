import type { ReactNode } from "react";

/**
 * Tipos compartilhados do site institucional (MARKETING-015 / SPEC-002 / SPEC-003).
 * Sem `any`. Consumidos por constants e components/marketing.
 */

export type NavItem = {
  label: string;
  href: string;
};

export type SocialIconId = "instagram" | "facebook" | "x" | "linkedin";

export type SocialLink = {
  label: string;
  href: string;
  icon: SocialIconId;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: ReactNode | string;
};

export type HomeHeroContent = {
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  backgroundSrc: string;
};

export type AboutSectionContent = {
  subtitle: string;
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
};

export type StudyMethodStage = {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

export type StudyMethodContent = {
  methodTitle: string;
  methodBody: string;
  stagesTitle: string;
  stages: StudyMethodStage[];
};

export type BlogPostCard = {
  title: string;
  excerpt: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  dateLabel?: string;
};

export type BreadcrumbParent = {
  label: string;
  href: string;
};
