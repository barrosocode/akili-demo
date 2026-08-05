import { AboutPlatform } from "@/components/marketing/home/AboutPlatform";
import { AboutUs } from "@/components/marketing/home/AboutUs";
import { BlogPreview } from "@/components/marketing/home/BlogPreview";
import { FaqSection } from "@/components/marketing/home/FaqSection";
import { Hero } from "@/components/marketing/home/Hero";
import { HomeCta } from "@/components/marketing/home/HomeCta";
import { StudyMethod } from "@/components/marketing/home/StudyMethod";

/**
 * Composição da home institucional (MARKETING-040).
 * Ordem: Hero → Plataforma → Sobre → Método → FAQ → Blog → CTA.
 */
export function MarketingHome() {
  return (
    <>
      <Hero />
      <AboutPlatform />
      <AboutUs />
      <StudyMethod />
      <FaqSection />
      <BlogPreview />
      <HomeCta />
    </>
  );
}
