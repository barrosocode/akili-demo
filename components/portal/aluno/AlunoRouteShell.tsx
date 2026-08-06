"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AlunoDashboardShell } from "@/components/portal/aluno/AlunoDashboardShell";

function isImmersiveLessonPath(pathname: string): boolean {
  // /aluno/materiais/{uuid}
  if (/^\/aluno\/materiais\/[^/]+$/.test(pathname)) return true;
  // /aluno/supervisao/{ref}/materiais/{uuid}
  if (/^\/aluno\/supervisao\/[^/]+\/materiais\/[^/]+$/.test(pathname)) {
    return true;
  }
  return false;
}

function resolveActiveHref(pathname: string): string | undefined {
  if (pathname.startsWith("/aluno/materiais")) return "/aluno/materiais";
  if (pathname === "/aluno" || pathname === "/aluno/") return "/aluno";
  return undefined;
}

/**
 * Shell Kiddino do aluno com fullBleed automático na rota da lição.
 */
export function AlunoRouteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const fullBleed = isImmersiveLessonPath(pathname);

  return (
    <AlunoDashboardShell
      fullBleed={fullBleed}
      activeHref={resolveActiveHref(pathname)}
    >
      {children}
    </AlunoDashboardShell>
  );
}
