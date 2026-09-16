import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { hasAssistanceSessionCookie } from "@/lib/auth/assistance-cookies";
import { getServerSession } from "@/lib/auth/session";
import { GuardianDashboardShell } from "@/components/portal/guardian/GuardianDashboardShell";
import { GuardianGuard } from "@/features/auth";
import { ChildrenHome } from "@/features/children";
import { ASSISTANCE_ENTER_PATH } from "@/features/assistance/paths";
import { shouldShowMarketingHome } from "@/features/assistance/home-guard";
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
  const hasAssistanceCookie = await hasAssistanceSessionCookie();

  if (
    shouldShowMarketingHome({
      hasSession: Boolean(session),
      hasAssistanceCookie,
    })
  ) {
    const { PublicMarketingHome } = await import(
      "@/components/marketing/home/PublicMarketingHome"
    );
    return <PublicMarketingHome />;
  }

  // Cookie de assistência presente, sessão ainda não resolvida no RSC.
  if (!session) {
    redirect(ASSISTANCE_ENTER_PATH);
  }

  if (!session.terms.allAccepted && !session.assistance?.active) {
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
