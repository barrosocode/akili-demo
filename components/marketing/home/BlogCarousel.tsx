"use client";

import type { ReactNode } from "react";
import { useRef } from "react";

type BlogCarouselProps = {
  children: ReactNode;
  label?: string;
};

/**
 * Carousel de posts (MARKETING-037) — CSS scroll-snap, sem Slick/jQuery.
 * Client Component — navegação por botões + teclado nativo no scroll.
 */
export function BlogCarousel({
  children,
  label = "Publicações recentes",
}: BlogCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByPage(direction: -1 | 1) {
    const node = scrollerRef.current;
    if (!node) {
      return;
    }
    const amount = Math.max(node.clientWidth * 0.85, 280);
    node.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  return (
    <div className="marketing-blog-carousel">
      <div
        ref={scrollerRef}
        className="marketing-blog-carousel__track"
        role="region"
        aria-label={label}
        tabIndex={0}
      >
        {children}
      </div>
      <div className="marketing-blog-carousel__nav">
        <button
          type="button"
          className="marketing-blog-carousel__btn"
          aria-label="Publicações anteriores"
          onClick={() => {
            scrollByPage(-1);
          }}
        >
          ‹
        </button>
        <button
          type="button"
          className="marketing-blog-carousel__btn"
          aria-label="Próximas publicações"
          onClick={() => {
            scrollByPage(1);
          }}
        >
          ›
        </button>
      </div>
    </div>
  );
}
