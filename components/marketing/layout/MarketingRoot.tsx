import type { ReactNode } from "react";

import { MarketingThemeStyles } from "@/components/marketing/layout/MarketingThemeStyles";
import { marketingFontVariables } from "@/lib/marketing/fonts";

type MarketingRootProps = {
  children: ReactNode;
};

/**
 * Root visual do site institucional (SPEC-002 / SPEC-007).
 * Isola classes do tema (`layout4`) + variáveis de fonte.
 * Usado por `MarketingShell` (028); home `/` ainda em `app/page.tsx` (A-009).
 */
export function MarketingRoot({ children }: MarketingRootProps) {
  return (
    <>
      <MarketingThemeStyles />
      <div className={`marketing-root layout4 ${marketingFontVariables}`}>
        {children}
      </div>
    </>
  );
}
