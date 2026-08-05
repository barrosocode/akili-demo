import Image from "next/image";

import { Button } from "@/components/marketing/common/Button";
import { homeHeroContent } from "@/constants/home-content";
import type { HomeHeroContent } from "@/types/marketing";

type HeroProps = {
  content?: HomeHeroContent;
};

/**
 * Hero full-bleed da home institucional (MARKETING-030 / heroView.php).
 * Server Component — LCP via `next/image` fill + priority (sem jQuery / data-bg-src).
 */
export function Hero({ content = homeHeroContent }: HeroProps) {
  return (
    <section className="vs-hero-wrapper4" aria-labelledby="marketing-hero-title">
      <div className="banner-slide4">
        <Image
          src={content.backgroundSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "bottom" }}
          aria-hidden
        />
        <div className="banner-slide4-content">
          <div className="container-style4">
            <div className="banner-content4">
              <h1 id="marketing-hero-title" className="banner-title">
                {content.title}
              </h1>
              <p>{content.body}</p>
              <Button href={content.ctaHref} variant="banner">
                {content.ctaLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
