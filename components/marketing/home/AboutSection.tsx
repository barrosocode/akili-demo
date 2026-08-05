import Image from "next/image";

import type { AboutSectionContent } from "@/types/marketing";

export type AboutImagePosition = "start" | "end";

type AboutSectionProps = {
  content: AboutSectionContent;
  titleId: string;
  imagePosition?: AboutImagePosition;
};

/**
 * Bloco imagem + texto reutilizado por Plataforma / Sobre (MARKETING-031/032).
 * Server Component.
 */
export function AboutSection({
  content,
  titleId,
  imagePosition = "start",
}: AboutSectionProps) {
  const imageColumn = (
    <div className="col-lg-6 col-md-12 col-sm-12">
      <div className="about-img-four">
        <Image
          src={content.imageSrc}
          alt={content.imageAlt}
          width={800}
          height={640}
          sizes="(max-width: 991px) 100vw, 50vw"
        />
      </div>
    </div>
  );

  const textColumn = (
    <div className="col-lg-6 col-md-12 col-sm-12">
      <div className="about-content4">
        <span className="sub-title">{content.subtitle}</span>
        <h2 id={titleId}>{content.title}</h2>
        <p>{content.body}</p>
      </div>
    </div>
  );

  return (
    <section className="about-section-four mt-5" aria-labelledby={titleId}>
      <div className="container-style4">
        <div className="row">
          {imagePosition === "start" ? (
            <>
              {imageColumn}
              {textColumn}
            </>
          ) : (
            <>
              {textColumn}
              {imageColumn}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
