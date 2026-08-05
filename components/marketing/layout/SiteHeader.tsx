import { Button } from "@/components/marketing/common/Button";
import { Logo } from "@/components/marketing/common/Logo";
import { MainNav } from "@/components/marketing/layout/MainNav";
import { MobileMenuToggle } from "@/components/marketing/layout/MobileMenu";
import { TopBar } from "@/components/marketing/layout/TopBar";
import { authLinks, mainNav } from "@/constants/navigation";
import type { NavItem } from "@/types/marketing";

type SiteHeaderProps = {
  navItems?: NavItem[];
  showLoginCta?: boolean;
};

/**
 * Header institucional (SPEC-003 / MARKETING-022).
 * Server Component — `MobileMenuToggle` é client via MarketingChrome (023/028).
 */
export function SiteHeader({
  navItems = mainNav,
  showLoginCta = true,
}: SiteHeaderProps) {
  return (
    <header className="vs-header header-layout4">
      <TopBar showLoginCta={showLoginCta} />
      <div className="sticky-wrap">
        <div className="sticky-active">
          <div className="container-style4">
            <div className="header-lower4">
              <div className="row gx-3 align-items-center justify-content-between">
                <div className="col-8 col-sm-auto">
                  <div className="header-logo2">
                    <Logo variant="positive" href="/" priority />
                  </div>
                </div>
                <div className="col">
                  <MainNav variant="desktop" items={navItems} />
                </div>
                <div className="col-auto d-none d-lg-flex align-items-center gap-2">
                  {showLoginCta ? (
                    <Button href={authLinks.login.href} variant="v4">
                      {authLinks.login.label}
                    </Button>
                  ) : null}
                  <Button href={authLinks.register.href} variant="v4">
                    {authLinks.register.label}
                  </Button>
                </div>
                <MobileMenuToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
