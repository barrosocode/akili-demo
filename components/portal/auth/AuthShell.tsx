import type { ReactNode } from "react";

import { MarketingShell } from "@/components/marketing/layout/MarketingShell";

type AuthShellProps = {
  children: ReactNode;
};

/**
 * Shell de auth — reutiliza o chrome institucional (ADR-018 / SPEC-019).
 * Preferir `MarketingShell` diretamente em layouts novos.
 */
export function AuthShell({ children }: AuthShellProps) {
  return <MarketingShell>{children}</MarketingShell>;
}
