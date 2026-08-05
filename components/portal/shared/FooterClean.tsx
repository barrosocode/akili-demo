import Link from "next/link";

import { siteConfig } from "@/constants/site";

/**
 * Footer limpo do dashboard (PORTAL-006 / footerCleanView.php).
 */
export function FooterClean() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-wrapper footer-layout4">
      <div className="footer-bottom5">
        <div className="container-style4">
          <div className="copyright-wrap-five">
            <p className="copyright-text text-white">
              Copyright &copy; {year}{" "}
              <Link href="/">{siteConfig.brand.name}</Link>. Todos os Direitos
              Reservados
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
