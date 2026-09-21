import type { ReactNode } from "react";

import { AlunoRouteShell } from "@/components/portal/aluno/AlunoRouteShell";
import { AlunoSupportChrome } from "@/components/portal/aluno/AlunoSupportChrome";
import { GuardianGuard } from "@/features/auth";

export default function SupervisionLayout({ children }: { children: ReactNode }) {
  return (
    <AlunoSupportChrome>
      <AlunoRouteShell>
        <GuardianGuard>{children}</GuardianGuard>
      </AlunoRouteShell>
    </AlunoSupportChrome>
  );
}
