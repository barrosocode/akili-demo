import Link from "next/link";

import { ContactInfo } from "@/components/marketing/common/ContactInfo";
import { SocialLinks } from "@/components/marketing/common/SocialLinks";
import { authLinks } from "@/constants/navigation";

type TopBarProps = {
  showLoginCta?: boolean;
};

/**
 * Faixa superior do header (SPEC-003 / MARKETING-019).
 * Server Component — paridade com `headerAreaView` top.
 */
export function TopBar({ showLoginCta = true }: TopBarProps) {
  return (
    <div className="header-top4">
      <div className="container-style4">
        <div className="row justify-content-between align-items-center">
          <div className="col-lg-auto text-center">
            <ContactInfo />
          </div>
          <div className="col-auto d-none d-lg-block">
            <div className="header-links v5 style-white">
              <ul>
                <li>
                  <SocialLinks />
                </li>
                {showLoginCta ? (
                  <li>
                    <Link href={authLinks.login.href}>
                      <i className="far fa-user" aria-hidden="true" />
                      {authLinks.login.label}
                    </Link>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
