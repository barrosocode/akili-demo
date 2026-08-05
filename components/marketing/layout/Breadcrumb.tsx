import Link from "next/link";

import type { BreadcrumbParent } from "@/types/marketing";

type BreadcrumbProps = {
  title: string;
  parent?: BreadcrumbParent;
  backgroundSrc?: string;
};

const DEFAULT_BG = "/assets/img/breadcumb/breadcumb-bg.jpg";

/**
 * Breadcrumb de páginas internas (MARKETING-027 / breadcrumbView.php).
 * Server Component — sem jQuery / data-bg-src.
 */
export function Breadcrumb({
  title,
  parent = { label: "Home", href: "/" },
  backgroundSrc = DEFAULT_BG,
}: BreadcrumbProps) {
  return (
    <nav
      className="breadcumb-wrapper"
      aria-label="Breadcrumb"
      style={{
        backgroundImage: `url('${backgroundSrc}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container z-index-common">
        <div className="breadcumb-content">
          <h1 className="breadcumb-title">{title}</h1>
          <div className="breadcumb-menu-wrap">
            <ul className="breadcumb-menu">
              <li>
                <Link href={parent.href}>{parent.label}</Link>
              </li>
              <li aria-current="page">{title}</li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
