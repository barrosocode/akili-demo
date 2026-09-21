import type { ReactNode } from "react";

import { AlunoRouteShell } from "@/components/portal/aluno/AlunoRouteShell";
import { AlunoSupportChrome } from "@/components/portal/aluno/AlunoSupportChrome";
import { StudentGuard } from "@/features/auth/components/student-guard";

export default function StudentAreaLayout({ children }: { children: ReactNode }) {
  return (
    <AlunoSupportChrome>
      <AlunoRouteShell>
        <StudentGuard>{children}</StudentGuard>
      </AlunoRouteShell>
    </AlunoSupportChrome>
  );
}
