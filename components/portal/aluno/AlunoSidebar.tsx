"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  resolveStudentShellActiveHref,
  resolveStudentShellNav,
} from "@/lib/auth/portal-paths";

type AlunoSidebarProps = {
  activeHref?: string;
};

/**
 * Sidebar do aluno / supervisão (PORTAL-012).
 * Em supervisão, "Início" volta ao portal do responsável — nunca para `/aluno`.
 */
export function AlunoSidebar({ activeHref }: AlunoSidebarProps) {
  const pathname = usePathname() ?? "";
  const nav = resolveStudentShellNav(pathname);
  const resolvedActive = activeHref ?? resolveStudentShellActiveHref(pathname);

  return (
    <aside className="sidebar-area">
      <div className="widget widget_categories">
        <h3 className="widget_title">Estudos</h3>
        <ul>
          {nav.map((item) => (
            <li
              key={item.key}
              className={
                resolvedActive === item.href ? "current-menu-item" : undefined
              }
            >
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
