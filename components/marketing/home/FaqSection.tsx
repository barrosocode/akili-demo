import Image from "next/image";

import { FaqAccordion } from "@/components/marketing/home/FaqAccordion";
import { faqItems, faqSectionMeta } from "@/constants/faq";
import type { FaqItem } from "@/types/marketing";

type FaqSectionProps = {
  items?: FaqItem[];
  subtitle?: string;
  title?: string;
  imageSrc?: string;
  imageAlt?: string;
};

/**
 * Seção FAQ da home (MARKETING-035 / faqView.php).
 * Server Component — imagem + título; accordion é Client.
 */
export function FaqSection({
  items = faqItems,
  subtitle = faqSectionMeta.subtitle,
  title = faqSectionMeta.title,
  imageSrc = faqSectionMeta.imageSrc,
  imageAlt = faqSectionMeta.imageAlt,
}: FaqSectionProps) {
  return (
    <section className="faq-style2 space-extra-bottom space" aria-label={title}>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-xxl-auto pb-3 pb-xl-0">
            <div className="img-box3">
              <div className="title-area faq2 text-center text-lg-start">
                <span className="sec-subtitle">{subtitle}</span>
                <h2 className="sec-title">{title}</h2>
              </div>
              <div className="img-1">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  width={617}
                  height={326}
                  sizes="(max-width: 991px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
          <div className="col-lg-6 align-self-center">
            <FaqAccordion items={items} />
          </div>
        </div>
      </div>
    </section>
  );
}
