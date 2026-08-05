import { Button } from "@/components/marketing/common/Button";
import { homeCtaContent } from "@/constants/home-content";

type HomeCtaProps = {
  title?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

/**
 * CTA final da home (MARKETING-039).
 * Server Component — destino padrão `/cadastro`.
 */
export function HomeCta({
  title = homeCtaContent.title,
  body = homeCtaContent.body,
  ctaLabel = homeCtaContent.ctaLabel,
  ctaHref = homeCtaContent.ctaHref,
}: HomeCtaProps) {
  return (
    <section className="space space-extra-bottom" aria-label={title}>
      <div className="container-style4 text-center">
        <h2 className="sec-title">{title}</h2>
        <p className="mx-auto mb-4" style={{ maxWidth: "40rem" }}>
          {body}
        </p>
        <Button href={ctaHref} variant="v4">
          {ctaLabel}
        </Button>
      </div>
    </section>
  );
}
