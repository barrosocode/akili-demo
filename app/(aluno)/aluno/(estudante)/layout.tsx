import type { ReactNode } from "react";

import { AlunoRouteShell } from "@/components/portal/aluno/AlunoRouteShell";
import { StudentGuard } from "@/features/auth/components/student-guard";

export default function StudentAreaLayout({ children }: { children: ReactNode }) {
  return (
    <StudentGuard>
      <AlunoRouteShell>{children}</AlunoRouteShell>
    </StudentGuard>
  );
}
