"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChartColumn,
  CircleHelp,
  FileText,
  GraduationCap,
  Home,
  type LucideIcon,
} from "lucide-react";

import {
  resolveStudentShellActiveHref,
  resolveStudentShellNav,
  type StudentShellNavItem,
} from "@/lib/auth/portal-paths";

type AlunoSidebarProps = {
  activeHref?: string;
};

const NAV_ICONS: Record<StudentShellNavItem["key"], LucideIcon> = {
  home: Home,
  courses: BookOpen,
  progress: ChartColumn,
  materials: FileText,
  help: CircleHelp,
  environment: GraduationCap,
  studies: BookOpen,
};

function isCurrentItem(item: StudentShellNavItem, activeHref: string | undefined): boolean {
  if (!activeHref) return false;
  return item.href === activeHref;
}

function SidebarCheer() {
  return (
    <div className="aluno-sidebar__cheer" aria-hidden="true">
      <svg className="aluno-sidebar__sprout" viewBox="0 0 72 78" focusable="false">
        <path
          d="M36 74c0-16 1-28 2-38"
          fill="none"
          stroke="#3d9a45"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M38 40c-14 2-24-6-26-18 12 1 22 8 26 18z"
          fill="#7dce57"
        />
        <path
          d="M37 36c12-8 24-6 28 4-14 2-24 2-28-4z"
          fill="#b6e36a"
        />
        <circle cx="34" cy="16" r="7" fill="#8ed45a" />
        <path
          d="M30 22c2 6 6 10 8 16"
          fill="none"
          stroke="#3d9a45"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <p className="aluno-sidebar__cheer-text">
        Você
        <br />
        consegue!
      </p>
    </div>
  );
}

/**
 * Sidebar do aluno / supervisão (PORTAL-012).
 * Em supervisão, "Início" volta ao portal do responsável — nunca para `/aluno`.
 */
export function AlunoSidebar({ activeHref }: AlunoSidebarProps) {
  const pathname = usePathname() ?? "";
  const nav = resolveStudentShellNav(pathname);
  const resolvedActive = activeHref ?? resolveStudentShellActiveHref(pathname);

  return (
    <aside className="aluno-sidebar">
      <nav aria-label="Estudos">
        <ul className="aluno-sidebar__list">
          {nav.map((item) => {
            const Icon = NAV_ICONS[item.key];
            const current = isCurrentItem(item, resolvedActive);

            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={
                    current ? "aluno-sidebar__link is-current" : "aluno-sidebar__link"
                  }
                  aria-current={current ? "page" : undefined}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <SidebarCheer />
    </aside>
  );
}
