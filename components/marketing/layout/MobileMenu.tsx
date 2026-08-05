"use client";

import { useEffect, useRef } from "react";

import { Logo } from "@/components/marketing/common/Logo";
import { useMarketingChrome } from "@/components/marketing/layout/MarketingChrome";
import { MainNav } from "@/components/marketing/layout/MainNav";
import type { NavItem } from "@/types/marketing";

type MobileMenuProps = {
  items?: NavItem[];
};

/**
 * Toggle do header (visível apenas abaixo do breakpoint lg).
 * Wire no SiteHeader (MARKETING-022).
 */
export function MobileMenuToggle() {
  const { isOpen, toggle, menuToggleRef } = useMarketingChrome();

  return (
    <button
      ref={menuToggleRef}
      type="button"
      className="vs-menu-toggle d-inline-block d-lg-none"
      aria-expanded={isOpen}
      aria-controls="marketing-mobile-menu"
      aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
      onClick={toggle}
    >
      <i className="fal fa-bars" aria-hidden="true" />
    </button>
  );
}

/**
 * Off-canvas mobile (SPEC-003 / MARKETING-023). Substitui jQuery `vsmobilemenu`.
 */
export function MobileMenu({ items }: MobileMenuProps) {
  const { isOpen, close, menuToggleRef } = useMarketingChrome();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      closeButtonRef.current?.focus();
      return;
    }

    if (wasOpenRef.current) {
      menuToggleRef.current?.focus();
      wasOpenRef.current = false;
    }
  }, [isOpen, menuToggleRef]);

  return (
    <div
      id="marketing-mobile-menu"
      className={
        isOpen ? "vs-menu-wrapper vs-body-visible" : "vs-menu-wrapper"
      }
      onClick={close}
      aria-hidden={!isOpen}
    >
      <div
        className="vs-menu-area text-center"
        role="dialog"
        aria-modal={isOpen}
        aria-label="Menu de navegação"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="vs-menu-toggle"
          aria-label="Fechar menu"
          onClick={close}
        >
          <i className="fal fa-times" aria-hidden="true" />
        </button>
        <div className="mobile-logo" onClick={close}>
          <Logo variant="positive" />
        </div>
        <MainNav variant="mobile" items={items} onNavigate={close} />
      </div>
    </div>
  );
}
