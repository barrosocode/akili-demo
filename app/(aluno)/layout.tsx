import type { ReactNode } from "react";

import { AlunoDashboardShell } from "@/components/portal/aluno/AlunoDashboardShell";

import "@/styles/marketing.css";

export default function AlunoLayout({ children }: { children: ReactNode }) {
  return <AlunoDashboardShell>{children}</AlunoDashboardShell>;
}
