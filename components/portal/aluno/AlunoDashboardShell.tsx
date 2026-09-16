import type { ReactNode } from "react";

import { AlunoHeader } from "@/components/portal/aluno/AlunoHeader";
import { AlunoSidebar } from "@/components/portal/aluno/AlunoSidebar";
import { FooterClean } from "@/components/portal/shared/FooterClean";
import { ScrollToTop } from "@/components/marketing/layout/ScrollToTop";
import { KiddinoRoot } from "@/components/theme/KiddinoRoot";
import { AssistanceBanner } from "@/features/assistance/components/AssistanceBanner";
import { AssistanceExpiryWatcher } from "@/features/assistance/components/AssistanceExpiryWatcher";
import { STUDENT_HOME_PATH } from "@/lib/auth/portal-paths";

type AlunoDashboardShellProps = {
  children: ReactNode;
  activeHref?: string;
  fullBleed?: boolean;
  homeHref?: string;
  footerHomeHref?: string;
};

/**
 * Shell do dashboard do aluno (PORTAL-012).
 * Também envolve supervisão do responsável (`/aluno/supervisao/**` via AlunoRouteShell).
 */
export function AlunoDashboardShell({
  children,
  activeHref,
  fullBleed = false,
  homeHref = STUDENT_HOME_PATH,
  footerHomeHref = STUDENT_HOME_PATH,
}: AlunoDashboardShellProps) {
  return (
    <KiddinoRoot>
      <AssistanceBanner />
      <AssistanceExpiryWatcher />
      <AlunoHeader homeHref={homeHref} />
      <section className="vs-blog-wrapper blog-details space-top space-extra-bottom">
        <div className="container">
          {fullBleed ? (
            <div className="row gx-40">
              <div className="col-12">{children}</div>
            </div>
          ) : (
            <div className="row gx-40">
              <div className="col-lg-4">
                <AlunoSidebar activeHref={activeHref} />
              </div>
              <div className="col-lg-8">{children}</div>
            </div>
          )}
        </div>
      </section>
      <FooterClean homeHref={footerHomeHref} />
      <ScrollToTop />
    </KiddinoRoot>
  );
}
