import { AboutPlatform } from "@/components/marketing/home/AboutPlatform";
import { AboutUs } from "@/components/marketing/home/AboutUs";
import { Breadcrumb } from "@/components/marketing/layout/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/marketing/seo/BreadcrumbJsonLd";
import { buildPageMetadata, marketingPageSeo } from "@/constants/seo";

export const metadata = buildPageMetadata(marketingPageSeo.sobreNos);

export default function SobreNosPage() {
  const { title, path } = marketingPageSeo.sobreNos;

  return (
    <>
      <BreadcrumbJsonLd title={title} path={path} />
      <Breadcrumb title={title} />
      <AboutPlatform />
      <AboutUs />
    </>
  );
}
