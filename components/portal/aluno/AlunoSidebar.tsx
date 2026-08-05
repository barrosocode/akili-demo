import Link from "next/link";

import type { NavItem } from "@/types/marketing";

const alunoNav: NavItem[] = [
  { label: "Início", href: "/aluno" },
  { label: "Disciplinas", href: "/aluno/disciplinas" },
  { label: "Cadernos", href: "/aluno/cadernos" },
  { label: "Conteúdos recentes", href: "/aluno/recentes" },
];

type AlunoSidebarProps = {
  activeHref?: string;
};

/**
 * Sidebar do aluno (PORTAL-012).
 */
export function AlunoSidebar({ activeHref }: AlunoSidebarProps) {
  return (
    <aside className="sidebar-area">
      <div className="widget widget_categories">
        <h3 className="widget_title">Estudos</h3>
        <ul>
          {alunoNav.map((item) => (
            <li
              key={item.href}
              className={activeHref === item.href ? "current-menu-item" : undefined}
            >
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
