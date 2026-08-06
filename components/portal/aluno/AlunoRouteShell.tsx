"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AlunoDashboardShell } from "@/components/portal/aluno/AlunoDashboardShell";
import {
  GUARDIAN_HOME_PATH,
  isSupervisionPath,
  resolveStudentShellActiveHref,
  STUDENT_HOME_PATH,
} from "@/lib/auth/portal-paths";

function isImmersiveLessonPath(pathname: string): boolean {
  if (/^\/aluno\/materiais\/[^/]+$/.test(pathname)) return true;
  if (/^\/aluno\/supervisao\/[^/]+\/materiais\/[^/]+$/.test(pathname)) {
    return true;
  }
  return false;
}

/**
 * Shell Kiddino do aluno (sessão student) ou supervisão (sessão guardian).
 */
export function AlunoRouteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const fullBleed = isImmersiveLessonPath(pathname);
  const supervision = isSupervisionPath(pathname);

  return (
    <AlunoDashboardShell
      fullBleed={fullBleed}
      activeHref={resolveStudentShellActiveHref(pathname)}
      homeHref={supervision ? GUARDIAN_HOME_PATH : STUDENT_HOME_PATH}
      footerHomeHref={supervision ? GUARDIAN_HOME_PATH : STUDENT_HOME_PATH}
    >
      {children}
    </AlunoDashboardShell>
  );
}
