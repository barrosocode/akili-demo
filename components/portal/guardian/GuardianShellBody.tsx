"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

type GuardianShellBodyProps = {
  children: ReactNode;
  sidebar: ReactNode;
};

/**
 * Switches to full-bleed content for Help Center routes (`/ajuda`).
 */
export function GuardianShellBody({ children, sidebar }: GuardianShellBodyProps) {
  const pathname = usePathname() ?? "/";
  const fullBleed = pathname === "/ajuda" || pathname.startsWith("/ajuda/");

  if (fullBleed) {
    return (
      <div className="row gx-40">
        <div className="col-12">{children}</div>
      </div>
    );
  }

  return (
    <div className="row gx-40">
      <div className="col-lg-4">{sidebar}</div>
      <div className="col-lg-8 portal-main-col">{children}</div>
    </div>
  );
}
