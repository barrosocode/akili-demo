import { JsonLd } from "@/components/marketing/seo/JsonLd";
import { faqItems } from "@/constants/faq";
import { siteConfig } from "@/constants/site";
import type { FaqItem } from "@/types/marketing";

type FaqPageJsonLdProps = {
  items?: FaqItem[];
  pageUrl?: string;
};

/**
 * FAQPage schema (MARKETING-054).
 */
export function FaqPageJsonLd({
  items = faqItems,
  pageUrl = `${siteConfig.siteUrl}/faq`,
}: FaqPageJsonLdProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        url: pageUrl,
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text:
              typeof item.answer === "string"
                ? item.answer
                : item.question,
          },
        })),
      }}
    />
  );
}
