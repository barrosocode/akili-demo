import Link from "next/link";

import type { NavItem } from "@/types/marketing";

const guardianNav: NavItem[] = [
  { label: "Meus filhos", href: "/" },
  { label: "Adicionar filho", href: "/children/new" },
  { label: "Compras", href: "/purchases" },
  { label: "Relatórios", href: "/relatorios" },
  { label: "Meus dados", href: "/profile" },
];

type GuardianSidebarProps = {
  activeHref?: string;
};

/**
 * Sidebar do responsável (PORTAL-006).
 */
export function GuardianSidebar({ activeHref }: GuardianSidebarProps) {
  return (
    <aside className="sidebar-area">
      <div className="widget widget_categories">
        <h3 className="widget_title">Menu</h3>
        <ul>
          {guardianNav.map((item) => (
            <li
              key={item.href}
              className={activeHref === item.href ? "current-menu-item" : undefined}
            >
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="widget">
        <h3 className="widget_title">Tutorial</h3>
        <p>
          Conheça a plataforma e acompanhe o progresso dos seus filhos com o
          método Akili Educ.
        </p>
      </div>
    </aside>
  );
}
