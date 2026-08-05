import { Button } from "@/components/marketing/common/Button";
import { Breadcrumb } from "@/components/marketing/layout/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/marketing/seo/BreadcrumbJsonLd";
import { planItems, plansPageMeta } from "@/constants/plans";
import { buildPageMetadata, marketingPageSeo } from "@/constants/seo";

export const metadata = buildPageMetadata(marketingPageSeo.precoEPlanos);

export default function PrecoEPlanosPage() {
  const { title, path } = marketingPageSeo.precoEPlanos;
  const familyPlans = planItems.filter((plan) => plan.audience === "family");
  const schoolPlans = planItems.filter((plan) => plan.audience === "school");

  return (
    <>
      <BreadcrumbJsonLd title={title} path={path} />
      <Breadcrumb title={title} />
      <section className="space space-extra-bottom">
        <div className="container-style4">
          <div className="title-area-four text-center active">
            <h2>{plansPageMeta.subtitle}</h2>
            <p className="mx-auto" style={{ maxWidth: "42rem" }}>
              {plansPageMeta.intro}
            </p>
          </div>

          <h3 className="text-center mb-4">Para famílias</h3>
          <div className="row justify-content-center">
            {familyPlans.map((plan) => (
              <div key={plan.id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                <div
                  className="p-4 h-100"
                  style={{
                    border: plan.highlighted
                      ? "2px solid var(--theme-color, #ff6b00)"
                      : "1px solid #e5e5e5",
                    borderRadius: "1rem",
                    background: "#fff",
                  }}
                >
                  <h3 className="title mb-2">{plan.name}</h3>
                  <p className="fw-semibold mb-2">{plan.priceLabel}</p>
                  <p>{plan.description}</p>
                  <ul className="mb-4">
                    {plan.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <Button
                    href={plan.ctaHref}
                    variant={plan.highlighted ? "v4" : "default"}
                  >
                    {plan.ctaLabel}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-center mb-4 mt-4">Para escolas</h3>
          <div className="row justify-content-center">
            {schoolPlans.map((plan) => (
              <div key={plan.id} className="col-lg-5 col-md-6 col-sm-12 mb-4">
                <div
                  className="p-4 h-100"
                  style={{
                    border: "1px solid #e5e5e5",
                    borderRadius: "1rem",
                    background: "#fff",
                  }}
                >
                  <h3 className="title mb-2">{plan.name}</h3>
                  <p className="fw-semibold mb-2">{plan.priceLabel}</p>
                  <p>{plan.description}</p>
                  <ul className="mb-4">
                    {plan.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <Button href={plan.ctaHref}>{plan.ctaLabel}</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
