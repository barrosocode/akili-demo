import Link from "next/link";

import { Logo } from "@/components/marketing/common/Logo";
import { SocialLinks } from "@/components/marketing/common/SocialLinks";
import { NewsletterForm } from "@/components/marketing/forms/NewsletterForm";
import { Copyright } from "@/components/marketing/layout/Copyright";
import { footerNav } from "@/constants/navigation";
import { siteConfig } from "@/constants/site";

/**
 * Footer institucional (SPEC-003 / MARKETING-025).
 * Server Component — `NewsletterForm` é client filho.
 */
export function SiteFooter() {
  const { email, phoneDisplay, phoneTel } = siteConfig.contact;

  return (
    <footer className="footer-wrapper footer-layout4">
      <div className="footer-top5">
        <div className="container-style4">
          <div className="footer-box5">
            <div className="row">
              <div className="col-lg-4 col-md-12 col-sm-12">
                <div className="footer-logo4">
                  <Logo variant="negative" href="/" />
                </div>
              </div>
              <div className="col-lg-8">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="footer-contact5">
                      <div className="footer-icon">
                        <i className="fa fa-envelope" aria-hidden="true" />
                      </div>
                      <div className="footer-contact-content">
                        <h4 className="title">E-mail:</h4>
                        <a href={`mailto:${email}`} className="gmail">
                          {email}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="footer-contact5">
                      <div className="footer-icon">
                        <i className="fa fa-mobile" aria-hidden="true" />
                      </div>
                      <div className="footer-contact-content">
                        <h4 className="title">Telefone</h4>
                        <a href={`tel:${phoneTel}`} className="gmail">
                          {phoneDisplay}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="widget-area-four">
        <div className="container">
          <div className="row justify-content-center gx-60">
            <div className="col-lg-4">
              <div className="widget footer-widget">
                <h3 className="widget_title v4">Sobre a {siteConfig.brand.name}</h3>
                <div className="widget-about-two">
                  <p>{siteConfig.brand.about}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="widget widget_nav_menu footer-widget">
                <h3 className="widget_title v4">Menu</h3>
                <div className="menu-all-pages-container footer-menu">
                  <ul className="menu v4">
                    {footerNav.map((item) => (
                      <li key={`${item.href}-${item.label}`}>
                        <Link href={item.href}>{item.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="widget footer-widget">
                <div className="footer-form-box">
                  <h3 className="widget_title form">Newsletter</h3>
                  <p>
                    Inscreva-se em nossa Newsletter e fique atento sobre as
                    novidades da {siteConfig.brand.name}
                  </p>
                  <NewsletterForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom5">
        <div className="container-style4">
          <div className="copyright-wrap-five">
            <Copyright />
            <SocialLinks variant="cluster" />
          </div>
        </div>
      </div>
    </footer>
  );
}
