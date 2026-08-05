"use client";

import {
  createContext,
  useContext,
  type ReactNode,
  type RefObject,
  useRef,
} from "react";

import {
  useMobileMenu,
  type MobileMenuControls,
} from "@/hooks/use-mobile-menu";

type MarketingChromeValue = MobileMenuControls & {
  menuToggleRef: RefObject<HTMLButtonElement | null>;
};

const MarketingChromeContext = createContext<MarketingChromeValue | null>(null);

type MarketingChromeProps = {
  children: ReactNode;
};

/**
 * Chrome client do marketing — estado compartilhado do menu mobile
 * (MARKETING-023). SiteHeader (022) consome o toggle via contexto.
 */
export function MarketingChrome({ children }: MarketingChromeProps) {
  const menu = useMobileMenu();
  const menuToggleRef = useRef<HTMLButtonElement | null>(null);

  return (
    <MarketingChromeContext.Provider value={{ ...menu, menuToggleRef }}>
      {children}
    </MarketingChromeContext.Provider>
  );
}

export function useMarketingChrome(): MarketingChromeValue {
  const context = useContext(MarketingChromeContext);

  if (!context) {
    throw new Error(
      "useMarketingChrome must be used within MarketingChrome.",
    );
  }

  return context;
}
