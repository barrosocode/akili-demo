import type { ReactNode } from "react";

import { MarketingChrome } from "@/components/marketing/layout/MarketingChrome";
import { MobileMenu } from "@/components/marketing/layout/MobileMenu";
import { ScrollToTop } from "@/components/marketing/layout/ScrollToTop";
import { SiteFooter } from "@/components/marketing/layout/SiteFooter";
import { SiteHeader } from "@/components/marketing/layout/SiteHeader";
import { KiddinoRoot } from "@/components/theme/KiddinoRoot";

type AuthShellProps = {
  children: ReactNode;
};

/**
 * Shell de auth com chrome institucional (PORTAL-002 / loginView.php).
 */
export function AuthShell({ children }: AuthShellProps) {
  return (
    <MarketingChrome>
      <KiddinoRoot>
        <MobileMenu />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <ScrollToTop />
      </KiddinoRoot>
    </MarketingChrome>
  );
}
