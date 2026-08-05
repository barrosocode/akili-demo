import type { ReactNode } from "react";

import { MarketingShell } from "@/components/marketing/layout/MarketingShell";
import { OrganizationJsonLd } from "@/components/marketing/seo/OrganizationJsonLd";
import { marketingLayoutMetadata } from "@/constants/seo";

import "@/styles/marketing.css";

export const metadata = marketingLayoutMetadata;

type MarketingLayoutProps = {
  children: ReactNode;
};

/**
 * Layout do route group `(marketing)`.
 * Sem `page.tsx` neste group: a home `/` fica em `app/page.tsx` (SPEC-002 A-009).
 */
export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <MarketingShell>
      <OrganizationJsonLd />
      {children}
    </MarketingShell>
  );
}
