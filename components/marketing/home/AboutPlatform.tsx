import { AboutSection } from "@/components/marketing/home/AboutSection";
import { homePlatformContent } from "@/constants/home-content";
import type { AboutSectionContent } from "@/types/marketing";

type AboutPlatformProps = {
  content?: AboutSectionContent;
};

/**
 * Seção “A Plataforma” da home (MARKETING-031 / akiliView.php).
 * Server Component — imagem à esquerda, texto à direita.
 */
export function AboutPlatform({ content = homePlatformContent }: AboutPlatformProps) {
  return (
    <AboutSection
      content={content}
      titleId="marketing-platform-title"
      imagePosition="start"
    />
  );
}
