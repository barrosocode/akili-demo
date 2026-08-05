import { NewsletterForm } from "@/components/marketing/forms/NewsletterForm";
import { Breadcrumb } from "@/components/marketing/layout/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/marketing/seo/BreadcrumbJsonLd";
import { buildPageMetadata, marketingPageSeo } from "@/constants/seo";

export const metadata = buildPageMetadata(marketingPageSeo.newsletter);

export default function NewsletterPage() {
  const { title, path } = marketingPageSeo.newsletter;

  return (
    <>
      <BreadcrumbJsonLd title={title} path={path} />
      <Breadcrumb title={title} />
      <section className="space space-extra-bottom">
        <div className="container-style4">
          <div className="row justify-content-center">
            <div className="col-lg-6 text-center">
              <h2 className="sec-title mb-3">Newsletter Akili</h2>
              <p className="mb-4">
                Receba novidades da plataforma e dicas práticas de estudo baseadas
                em neurociência.
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
