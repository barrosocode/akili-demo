"use client";

import { useScrollToTop } from "@/hooks/use-scroll-to-top";

type ScrollToTopProps = {
  threshold?: number;
  /** Extra class when another FAB occupies the default corner (e.g. Help Center). */
  offsetClassName?: string;
};

/**
 * Botão flutuante voltar ao topo (SPEC-003 / MARKETING-010).
 * Montagem no MarketingShell (028).
 */
export function ScrollToTop({
  threshold = 500,
  offsetClassName,
}: ScrollToTopProps) {
  const { isVisible, scrollToTop } = useScrollToTop({ threshold });

  const classes = [
    isVisible ? "scrollToTop scroll-btn show" : "scrollToTop scroll-btn",
    offsetClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      aria-label="Voltar ao topo"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      onClick={scrollToTop}
    >
      <i className="far fa-arrow-up" aria-hidden="true" />
    </button>
  );
}
