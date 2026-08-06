"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChildSwitcher } from "@/components/portal/guardian/ChildSwitcher";
import { GUARDIAN_HOME_PATH } from "@/lib/auth/portal-paths";
import type { NavItem } from "@/types/marketing";

const guardianNav: NavItem[] = [
  { label: "Início", href: GUARDIAN_HOME_PATH },
  { label: "Meus filhos", href: "/children" },
  { label: "Adicionar filho", href: "/children/new" },
  { label: "Compras", href: "/purchases" },
  { label: "Relatórios", href: "/relatorios" },
  { label: "Meus dados", href: "/profile" },
];

type GuardianSidebarProps = {
  activeHref?: string;
};

function isNavActive(pathname: string, href: string): boolean {
  if (href === GUARDIAN_HOME_PATH) {
    return pathname === "/" || pathname === "";
  }
  if (href === "/children") {
    return (
      pathname === "/children" ||
      (pathname.startsWith("/children/") && !pathname.startsWith("/children/new"))
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Sidebar do responsável (PORTAL-006).
 */
export function GuardianSidebar({ activeHref }: GuardianSidebarProps) {
  const pathname = usePathname() ?? "/";

  return (
    <aside className="sidebar-area">
      <ChildSwitcher />
      <div className="widget widget_categories">
        <h3 className="widget_title">Menu</h3>
        <ul>
          {guardianNav.map((item) => {
            const active =
              activeHref !== undefined
                ? activeHref === item.href ||
                  (item.href === GUARDIAN_HOME_PATH && activeHref === "/") ||
                  (item.href === "/children" &&
                    (activeHref === "/children" ||
                      activeHref.startsWith("/children/")))
                : isNavActive(pathname, item.href);

            return (
              <li
                key={item.href || "home"}
                className={active ? "current-menu-item" : undefined}
              >
                <Link href={item.href}>{item.label}</Link>
              </li>
            );
          })}
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
