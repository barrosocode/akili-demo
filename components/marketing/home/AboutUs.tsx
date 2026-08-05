import { AboutSection } from "@/components/marketing/home/AboutSection";
import { homeAboutContent } from "@/constants/home-content";
import type { AboutSectionContent } from "@/types/marketing";

type AboutUsProps = {
  content?: AboutSectionContent;
};

/**
 * Seção “Sobre Nós” da home (MARKETING-032 / sobre-nosView.php).
 * Server Component — texto à esquerda, imagem à direita (invertido vs Plataforma).
 */
export function AboutUs({ content = homeAboutContent }: AboutUsProps) {
  return (
    <AboutSection
      content={content}
      titleId="marketing-about-title"
      imagePosition="end"
    />
  );
}
