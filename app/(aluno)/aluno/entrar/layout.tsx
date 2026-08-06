import type { ReactNode } from "react";

import { AlunoDashboardShell } from "@/components/portal/aluno/AlunoDashboardShell";

export default function StudentLoginLayout({ children }: { children: ReactNode }) {
  return <AlunoDashboardShell fullBleed>{children}</AlunoDashboardShell>;
}
