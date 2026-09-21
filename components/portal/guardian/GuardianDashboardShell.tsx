import type { ReactNode } from "react";

import { GuardianHeader } from "@/components/portal/guardian/GuardianHeader";
import { GuardianSidebar } from "@/components/portal/guardian/GuardianSidebar";
import { GuardianShellBody } from "@/components/portal/guardian/GuardianShellBody";
import { FooterClean } from "@/components/portal/shared/FooterClean";
import { ScrollToTop } from "@/components/marketing/layout/ScrollToTop";
import { KiddinoRoot } from "@/components/theme/KiddinoRoot";
import { AssistanceBanner } from "@/features/assistance/components/AssistanceBanner";
import { AssistanceExpiryWatcher } from "@/features/assistance/components/AssistanceExpiryWatcher";
import { AssistanceShellChrome } from "@/features/assistance/components/AssistanceShellChrome";
import { SupportFloatingButton } from "@/features/support";
import { TawkProvider } from "@/features/support/tawk";
import { readTawkPublicConfig } from "@/features/support/tawk/read-tawk-public-config";

type GuardianDashboardShellProps = {
  children: ReactNode;
  activeHref?: string;
  fullBleed?: boolean;
  cartTotalLabel?: string;
};

/**
 * Shell do dashboard do responsável (PORTAL-006).
 */
export function GuardianDashboardShell({
  children,
  activeHref,
  fullBleed = false,
  cartTotalLabel,
}: GuardianDashboardShellProps) {
  const tawkConfig = readTawkPublicConfig();

  return (
    <KiddinoRoot>
      <TawkProvider config={tawkConfig}>
        <AssistanceBanner />
        <AssistanceExpiryWatcher />
        <GuardianHeader cartTotalLabel={cartTotalLabel} />
        <section className="vs-blog-wrapper blog-details space-top space-extra-bottom">
          <div className="container">
            {fullBleed ? (
              <div className="row gx-40">
                <div className="col-12">{children}</div>
              </div>
            ) : (
              <GuardianShellBody sidebar={<GuardianSidebar activeHref={activeHref} />}>
                {children}
              </GuardianShellBody>
            )}
          </div>
        </section>
        <FooterClean />
        <AssistanceShellChrome>
          <SupportFloatingButton />
        </AssistanceShellChrome>
        <ScrollToTop offsetClassName="scrollToTop--above-support-fab" />
      </TawkProvider>
    </KiddinoRoot>
  );
}
