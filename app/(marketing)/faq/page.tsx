import { FaqSection } from "@/components/marketing/home/FaqSection";
import { Breadcrumb } from "@/components/marketing/layout/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/marketing/seo/BreadcrumbJsonLd";
import { FaqPageJsonLd } from "@/components/marketing/seo/FaqPageJsonLd";
import { buildPageMetadata, marketingPageSeo } from "@/constants/seo";

export const metadata = buildPageMetadata(marketingPageSeo.faq);

export default function FaqPage() {
  const { title, path } = marketingPageSeo.faq;

  return (
    <>
      <BreadcrumbJsonLd title={title} path={path} />
      <FaqPageJsonLd />
      <Breadcrumb title={title} />
      <FaqSection />
    </>
  );
}
