"use client";

import { useId, useState } from "react";

import { faqDefaultOpenId, faqItems } from "@/constants/faq";
import type { FaqItem } from "@/types/marketing";

type FaqAccordionVariant = "marketing" | "content";

type FaqAccordionProps = {
  items?: FaqItem[];
  defaultOpenId?: string;
  /**
   * `marketing` = FAQ da home (`v2`, position absolute).
   * `content` = colunas de conteúdo / dashboard (fluxo normal).
   */
  variant?: FaqAccordionVariant;
};

/**
 * Accordion FAQ acessível (MARKETING-034) — substitui Bootstrap JS / jQuery.
 * Client Component — um item aberto por vez (paridade `data-bs-parent`).
 */
export function FaqAccordion({
  items = faqItems,
  defaultOpenId = faqDefaultOpenId,
  variant = "marketing",
}: FaqAccordionProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  function toggle(id: string) {
    setOpenId((current) => (current === id ? null : id));
  }

  let accordionClassName: string;
  switch (variant) {
    case "marketing":
      accordionClassName = "accordion accordion-style1 v2";
      break;
    case "content":
      accordionClassName = "accordion accordion-style1";
      break;
    default: {
      const _exhaustive: never = variant;
      accordionClassName = _exhaustive;
    }
  }

  return (
    <div className={accordionClassName}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const headerId = `${baseId}-header-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;

        return (
          <div
            key={item.id}
            className={isOpen ? "accordion-item active" : "accordion-item"}
          >
            <div className="accordion-header" id={headerId}>
              <button
                type="button"
                className={
                  isOpen ? "accordion-button" : "accordion-button collapsed"
                }
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => {
                  toggle(item.id);
                }}
              >
                {item.question}
              </button>
            </div>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className={
                isOpen
                  ? "accordion-collapse collapse show"
                  : "accordion-collapse collapse"
              }
            >
              <div className="accordion-body">
                {typeof item.answer === "string" ? (
                  <p>{item.answer}</p>
                ) : (
                  item.answer
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
