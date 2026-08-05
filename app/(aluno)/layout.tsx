import type { ReactNode } from "react";

import { AlunoDashboardShell } from "@/components/portal/aluno/AlunoDashboardShell";
import { GuardianGuard } from "@/features/auth";

import "@/styles/marketing.css";

/**
 * Layout aluno — Kiddino.
 * TODO(api): guard específico de student dashboard quando sessão expuser tipo.
 * Por enquanto reutiliza sessão autenticada (guardian pode pré-visualizar UI).
 */
export default function AlunoLayout({ children }: { children: ReactNode }) {
  return (
    <GuardianGuard>
      <AlunoDashboardShell>{children}</AlunoDashboardShell>
    </GuardianGuard>
  );
}
