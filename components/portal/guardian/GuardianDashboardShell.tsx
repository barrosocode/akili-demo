import type { ReactNode } from "react";

import { GuardianHeader } from "@/components/portal/guardian/GuardianHeader";
import { GuardianSidebar } from "@/components/portal/guardian/GuardianSidebar";
import { FooterClean } from "@/components/portal/shared/FooterClean";
import { ScrollToTop } from "@/components/marketing/layout/ScrollToTop";
import { KiddinoRoot } from "@/components/theme/KiddinoRoot";

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
  return (
    <KiddinoRoot>
      <GuardianHeader cartTotalLabel={cartTotalLabel} />
      <section className="vs-blog-wrapper blog-details space-top space-extra-bottom">
        <div className="container">
          {fullBleed ? (
            <div className="row gx-40">
              <div className="col-12">{children}</div>
            </div>
          ) : (
            <div className="row gx-40">
              <div className="col-lg-4">
                <GuardianSidebar activeHref={activeHref} />
              </div>
              <div className="col-lg-8">{children}</div>
            </div>
          )}
        </div>
      </section>
      <FooterClean />
      <ScrollToTop />
    </KiddinoRoot>
  );
}
