import Link from "next/link";

import { siteConfig } from "@/constants/site";

type CopyrightProps = {
  className?: string;
};

/**
 * Faixa de copyright do marketing (MARKETING-026).
 * Server Component — ano dinâmico + link para a home.
 */
export function Copyright({ className = "copyright-text text-white" }: CopyrightProps) {
  const year = new Date().getFullYear();

  return (
    <p className={className}>
      Copyright &copy; {year}{" "}
      <Link href="/">{siteConfig.brand.name}</Link>. Todos os Direitos Reservados
    </p>
  );
}
