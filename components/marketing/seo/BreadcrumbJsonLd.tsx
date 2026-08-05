import { JsonLd } from "@/components/marketing/seo/JsonLd";
import { siteConfig } from "@/constants/site";
import type { BreadcrumbParent } from "@/types/marketing";

type BreadcrumbJsonLdProps = {
  title: string;
  path: string;
  parent?: BreadcrumbParent;
};

/**
 * BreadcrumbList schema (MARKETING-054).
 */
export function BreadcrumbJsonLd({
  title,
  path,
  parent = { label: "Home", href: "/" },
}: BreadcrumbJsonLdProps) {
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: parent.label,
      item: `${siteConfig.siteUrl}${parent.href === "/" ? "" : parent.href}`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: title,
      item: `${siteConfig.siteUrl}${path}`,
    },
  ];

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items,
      }}
    />
  );
}
