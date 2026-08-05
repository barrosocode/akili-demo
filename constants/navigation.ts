import type { NavItem } from "@/types/marketing";

/**
 * Navegação institucional — fonte única (SPEC-004 / MARKETING-007).
 * Home = `/` (nunca `/home` ou `index.html`).
 *
 * N-006: CTA "Cadastre-se" aponta para `/cadastro` (landing);
 * a conversão para `/checkout` fica na página MARKETING-048.
 */

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Sobre Nós", href: "/sobre-nos" },
  { label: "Séries", href: "/series" },
  { label: "Blog", href: "/blog" },
  { label: "Preço e Planos", href: "/preco-e-planos" },
  { label: "FAQ", href: "/faq" },
];

export const footerNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Sobre Nós", href: "/sobre-nos" },
  { label: "Séries", href: "/series" },
  { label: "Blog", href: "/blog" },
  { label: "Preços e Planos", href: "/preco-e-planos" },
  { label: "FAQ", href: "/faq" },
  { label: "Cadastre-se", href: "/cadastro" },
  { label: "Contato", href: "/contato" },
  { label: "Newsletter", href: "/newsletter" },
];

export const authLinks = {
  login: { label: "LOGIN", href: "/signin" },
  register: { label: "CADASTRE-SE", href: "/cadastro" },
  forgotPassword: { label: "Esqueceu a Senha?", href: "/forgot-password" },
} as const satisfies Record<string, NavItem>;
