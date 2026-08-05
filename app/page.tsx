import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth/session";
import { GuardianDashboardShell } from "@/components/portal/guardian/GuardianDashboardShell";
import { GuardianGuard } from "@/features/auth";
import { ChildrenHome } from "@/features/children";
import { buildPageMetadata, marketingPageSeo } from "@/constants/seo";

import "@/styles/marketing.css";

export async function generateMetadata(): Promise<Metadata> {
  const session = await getServerSession();
  if (!session) {
    return buildPageMetadata(marketingPageSeo.home);
  }
  return {
    title: "Meus filhos",
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

  if (!session.terms.allAccepted) {
    redirect("/terms");
  }

  return (
    <GuardianGuard>
      <GuardianDashboardShell activeHref="/">
        <ChildrenHome />
      </GuardianDashboardShell>
    </GuardianGuard>
  );
}
