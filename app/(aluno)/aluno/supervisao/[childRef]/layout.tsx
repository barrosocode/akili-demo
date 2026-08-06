import type { ReactNode } from "react";

import { AlunoRouteShell } from "@/components/portal/aluno/AlunoRouteShell";
import { GuardianGuard } from "@/features/auth";

export default function SupervisionLayout({ children }: { children: ReactNode }) {
  return (
    <AlunoRouteShell>
      <GuardianGuard>{children}</GuardianGuard>
    </AlunoRouteShell>
  );
}
