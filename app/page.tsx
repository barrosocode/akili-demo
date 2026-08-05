import type { Metadata } from "next";

import { getServerSession } from "@/lib/auth/session";
import { GuardianShell } from "@/components/layout/guardian-shell";
import { GuardianGuard } from "@/features/auth";
import { ChildrenHome } from "@/features/children";
import { buildPageMetadata, marketingPageSeo } from "@/constants/seo";

export async function generateMetadata(): Promise<Metadata> {
  const session = await getServerSession();
  if (!session) {
    return buildPageMetadata(marketingPageSeo.home);
  }
  return {
    title: "Início",
    robots: { index: false, follow: false },
  };
}

export default async function HomePage() {
  const session = await getServerSession();

  if (!session) {
    const { PublicMarketingHome } = await import(
      "@/components/marketing/home/PublicMarketingHome"
    );
    return <PublicMarketingHome />;
  }

  return (
    <GuardianGuard>
      <GuardianShell>
        <ChildrenHome />
      </GuardianShell>
    </GuardianGuard>
  );
}
