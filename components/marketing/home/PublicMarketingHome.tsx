import "@/styles/marketing.css";

import { MarketingHome } from "@/components/marketing/home/MarketingHome";
import { MarketingShell } from "@/components/marketing/layout/MarketingShell";
import { OrganizationJsonLd } from "@/components/marketing/seo/OrganizationJsonLd";

/**
 * Entry da home pública (MARKETING-041 / 042).
 * Import de `marketing.css` só neste módulo — carregado via dynamic import
 * no branch `!session` de `app/page.tsx` para não vazar Bootstrap no portal.
 */
export function PublicMarketingHome() {
  return (
    <MarketingShell>
      <OrganizationJsonLd />
      <MarketingHome />
    </MarketingShell>
  );
}
