import { ContactInfo } from "@/components/marketing/common/ContactInfo";
import { Breadcrumb } from "@/components/marketing/layout/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/marketing/seo/BreadcrumbJsonLd";
import { siteConfig } from "@/constants/site";
import { buildPageMetadata, marketingPageSeo } from "@/constants/seo";

export const metadata = buildPageMetadata(marketingPageSeo.contato);

export default function ContatoPage() {
  const { title, path } = marketingPageSeo.contato;
  const mailto = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent("Contato via site Akili Educ")}`;

  return (
    <>
      <BreadcrumbJsonLd title={title} path={path} />
      <Breadcrumb title={title} />
      <section className="space space-extra-bottom">
        <div className="container-style4">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="sec-title mb-3">Fale conosco</h2>
              <p className="mb-4">
                Prefere e-mail ou telefone? Use os canais abaixo — respondemos
                assim que possível.
              </p>
              <ContactInfo className="header-links v4" />
              <p className="mt-4">
                <a className="vs-btn v4" href={mailto}>
                  Escrever e-mail
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
