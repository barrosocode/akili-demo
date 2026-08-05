import type { ReactNode } from "react";

import { KiddinoThemeStyles } from "@/components/theme/KiddinoThemeStyles";
import { marketingFontVariables } from "@/lib/marketing/fonts";

type KiddinoRootProps = {
  children: ReactNode;
};

/**
 * Root visual Kiddino (SPEC-014) — marketing, auth e dashboards.
 */
export function KiddinoRoot({ children }: KiddinoRootProps) {
  return (
    <>
      <KiddinoThemeStyles />
      <div className={`marketing-root layout4 ${marketingFontVariables}`}>
        {children}
      </div>
    </>
  );
}
