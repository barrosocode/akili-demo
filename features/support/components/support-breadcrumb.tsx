"use client";

import Link from "next/link";
import { SUPPORT_PATHS } from "@/features/support/lib/paths";

export type SupportBreadcrumbItem = {
  label: string;
  href?: string;
};

type SupportBreadcrumbProps = {
  items: SupportBreadcrumbItem[];
};

export function SupportBreadcrumb({ items }: SupportBreadcrumbProps) {
  const crumbs: SupportBreadcrumbItem[] = [
    { label: "Central de Ajuda", href: SUPPORT_PATHS.home },
    ...items,
  ];

  return (
    <nav className="akili-support-breadcrumb" aria-label="Navegação da Central de Ajuda">
      <ol>
        {crumbs.map((item, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={`${item.label}-${index}`}>
              {!isLast && item.href ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
