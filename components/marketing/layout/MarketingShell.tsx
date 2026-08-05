import type { ReactNode } from "react";

import { MarketingChrome } from "@/components/marketing/layout/MarketingChrome";
import { MarketingRoot } from "@/components/marketing/layout/MarketingRoot";
import { MobileMenu } from "@/components/marketing/layout/MobileMenu";
import { ScrollToTop } from "@/components/marketing/layout/ScrollToTop";
import { SiteFooter } from "@/components/marketing/layout/SiteFooter";
import { SiteHeader } from "@/components/marketing/layout/SiteHeader";

type MarketingShellProps = {
  children: ReactNode;
  /** Quando false, oculta o CTA LOGIN no header (ex.: páginas de autenticação). */
  showLoginCta?: boolean;
};

/**
 * Shell do site institucional (SPEC-003 / MARKETING-028).
 * Ordem legado: mobile menu → header → conteúdo → footer → scroll top.
 * Server Component com islands client (Chrome, MobileMenu, ScrollToTop, Newsletter).
 */
export function MarketingShell({
  children,
  showLoginCta = true,
}: MarketingShellProps) {
  return (
    <MarketingChrome>
      <MarketingRoot>
        <MobileMenu showLoginCta={showLoginCta} />
        <SiteHeader showLoginCta={showLoginCta} />
        <main>{children}</main>
        <SiteFooter />
        <ScrollToTop />
      </MarketingRoot>
    </MarketingChrome>
  );
}
