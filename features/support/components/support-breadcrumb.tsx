"use client";

import Link from "next/link";
import { useSupportPaths } from "@/features/support/lib/use-support-paths";

export type SupportBreadcrumbItem = {
  label: string;
  href?: string;
};

type SupportBreadcrumbProps = {
  items: SupportBreadcrumbItem[];
};

export function SupportBreadcrumb({ items }: SupportBreadcrumbProps) {
  const paths = useSupportPaths();
  const crumbs: SupportBreadcrumbItem[] = [
    { label: "Central de Ajuda", href: paths.home },
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
