import type { ReactNode } from "react";

import { AlunoHeader } from "@/components/portal/aluno/AlunoHeader";
import { AlunoSidebar } from "@/components/portal/aluno/AlunoSidebar";
import { FooterClean } from "@/components/portal/shared/FooterClean";
import { ScrollToTop } from "@/components/marketing/layout/ScrollToTop";
import { KiddinoRoot } from "@/components/theme/KiddinoRoot";

type AlunoDashboardShellProps = {
  children: ReactNode;
  activeHref?: string;
  fullBleed?: boolean;
};

/**
 * Shell do dashboard do aluno (PORTAL-012).
 */
export function AlunoDashboardShell({
  children,
  activeHref,
  fullBleed = false,
}: AlunoDashboardShellProps) {
  return (
    <KiddinoRoot>
      <AlunoHeader />
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
      <FooterClean />
      <ScrollToTop />
    </KiddinoRoot>
  );
}
