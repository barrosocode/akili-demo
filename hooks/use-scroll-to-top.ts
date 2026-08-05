"use client";

import { useCallback, useEffect, useState } from "react";

type UseScrollToTopOptions = {
  threshold?: number;
};

type UseScrollToTopResult = {
  isVisible: boolean;
  scrollToTop: () => void;
};

/**
 * Visibilidade e ação do botão voltar ao topo (MARKETING-010).
 */
export function useScrollToTop({
  threshold = 500,
}: UseScrollToTopOptions = {}): UseScrollToTopResult {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setIsVisible(window.scrollY > threshold);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const scrollToTop = useCallback(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, []);

  return { isVisible, scrollToTop };
}
