import { JsonLd } from "@/components/marketing/seo/JsonLd";
import { siteConfig } from "@/constants/site";

/**
 * Organization schema (MARKETING-054).
 */
export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteConfig.brand.name,
        url: siteConfig.siteUrl,
        description: siteConfig.brand.tagline,
        logo: `${siteConfig.siteUrl}${siteConfig.assets.logoPositive.src}`,
        email: siteConfig.contact.email,
        sameAs: [
          siteConfig.social.instagram,
          siteConfig.social.facebook,
          siteConfig.social.x,
          siteConfig.social.linkedin,
        ],
      }}
    />
  );
}
