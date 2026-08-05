"use client";

import { useScrollToTop } from "@/hooks/use-scroll-to-top";

type ScrollToTopProps = {
  threshold?: number;
};

/**
 * Botão flutuante voltar ao topo (SPEC-003 / MARKETING-010).
 * Montagem no MarketingShell (028).
 */
export function ScrollToTop({ threshold = 500 }: ScrollToTopProps) {
  const { isVisible, scrollToTop } = useScrollToTop({ threshold });

  return (
    <button
      type="button"
      className={
        isVisible ? "scrollToTop scroll-btn show" : "scrollToTop scroll-btn"
      }
      aria-label="Voltar ao topo"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      onClick={scrollToTop}
    >
      <i className="far fa-arrow-up" aria-hidden="true" />
    </button>
  );
}
