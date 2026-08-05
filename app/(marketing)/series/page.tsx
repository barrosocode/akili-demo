import { Button } from "@/components/marketing/common/Button";
import { Breadcrumb } from "@/components/marketing/layout/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/marketing/seo/BreadcrumbJsonLd";
import { seriesItems, seriesPageMeta } from "@/constants/series";
import { buildPageMetadata, marketingPageSeo } from "@/constants/seo";

export const metadata = buildPageMetadata(marketingPageSeo.series);

export default function SeriesPage() {
  const { title, path } = marketingPageSeo.series;

  return (
    <>
      <BreadcrumbJsonLd title={title} path={path} />
      <Breadcrumb title={title} />
      <section className="space space-extra-bottom">
        <div className="container-style4">
          <div className="title-area-four text-center active">
            <h2>{seriesPageMeta.subtitle}</h2>
            <p className="mx-auto" style={{ maxWidth: "40rem" }}>
              {seriesPageMeta.intro}
            </p>
          </div>
          <div className="row">
            {seriesItems.map((item) => (
              <div key={item.id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                <div className="activity-box" style={{ paddingLeft: 0 }}>
                  <div className="activity-content">
                    <h3 className="title">{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Button href={seriesPageMeta.ctaHref} variant="v4">
              {seriesPageMeta.ctaLabel}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
