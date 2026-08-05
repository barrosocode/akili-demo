"use client";

import Link from "next/link";

import { mainNav as defaultMainNav } from "@/constants/navigation";
import type { NavItem } from "@/types/marketing";

type MainNavVariant = "desktop" | "mobile";

type MainNavProps = {
  items?: NavItem[];
  variant: MainNavVariant;
  onNavigate?: () => void;
  className?: string;
};

function navClassName(variant: MainNavVariant): string {
  switch (variant) {
    case "desktop":
      return "main-menu menu-style4 d-none d-lg-block";
    case "mobile":
      return "vs-mobile-menu";
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}

/**
 * Navegação principal desktop/mobile (SPEC-003 / MARKETING-021).
 * Client Component leve — `onClick`/`onNavigate` exigem boundary client
 * (fecha MobileMenu). Sem estado próprio.
 */
export function MainNav({
  items = defaultMainNav,
  variant,
  onNavigate,
  className,
}: MainNavProps) {
  return (
    <nav className={className ?? navClassName(variant)} aria-label="Principal">
      <ul>
        {items.map((item) => (
          <li key={`${item.href}-${item.label}`}>
            <Link href={item.href} onClick={onNavigate}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
