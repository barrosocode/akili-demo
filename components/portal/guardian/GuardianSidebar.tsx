"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChildSwitcher } from "@/components/portal/guardian/ChildSwitcher";
import { isAssistanceReadOnly } from "@/lib/permissions/guardian-capabilities";
import { GUARDIAN_HOME_PATH } from "@/lib/auth/portal-paths";
import { useSession } from "@/providers/session-provider";
import type { NavItem } from "@/types/marketing";

const guardianNav: NavItem[] = [
  { label: "Início", href: GUARDIAN_HOME_PATH },
  { label: "Meus filhos", href: "/children" },
  { label: "Adicionar filho", href: "/children/new" },
  { label: "Compras", href: "/purchases" },
  { label: "Relatórios", href: "/relatorios" },
  { label: "Central de Ajuda", href: "/ajuda" },
  { label: "Meus dados", href: "/profile" },
];

const READ_ONLY_HIDDEN_HREFS = new Set(["/children/new", "/purchases"]);

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
  const { user } = useSession();
  const readOnly = isAssistanceReadOnly(user);
  const items = readOnly
    ? guardianNav.filter((item) => !READ_ONLY_HIDDEN_HREFS.has(item.href))
    : guardianNav;

  return (
    <aside className="sidebar-area">
      <ChildSwitcher />
      <div className="widget widget_categories">
        <h3 className="widget_title">Menu</h3>
        <ul>
          {items.map((item) => {
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
        <h3 className="widget_title">Ajuda</h3>
        <p>
          {readOnly ? (
            "Modo atendimento: navegação liberada, alterações bloqueadas pelo sistema."
          ) : (
            <>
              Dúvidas sobre o portal? Consulte a{" "}
              <Link href="/ajuda">Central de Ajuda</Link> ou use o botão{" "}
              <strong>?</strong> no canto da tela.
            </>
          )}
        </p>
      </div>
    </aside>
  );
}
