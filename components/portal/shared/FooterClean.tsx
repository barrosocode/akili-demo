import Link from "next/link";

import { siteConfig } from "@/constants/site";
import { GUARDIAN_HOME_PATH } from "@/lib/auth/portal-paths";

type FooterCleanProps = {
  homeHref?: string;
};

/**
 * Footer limpo do dashboard (PORTAL-006 / footerCleanView.php).
 */
export function FooterClean({ homeHref = GUARDIAN_HOME_PATH }: FooterCleanProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-wrapper footer-layout4">
      <div className="footer-bottom5">
        <div className="container-style4">
          <div className="copyright-wrap-five">
            <p className="copyright-text text-white">
              Copyright &copy; {year}{" "}
              <Link href={homeHref}>{siteConfig.brand.name}</Link>. Todos os Direitos
              Reservados
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
