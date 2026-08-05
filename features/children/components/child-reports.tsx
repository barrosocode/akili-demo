"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { FaqAccordion } from "@/components/marketing/home/FaqAccordion";
import {
  formatReportBody,
  mockReportMonths,
  mockReportSections,
} from "@/features/children/data/mock-child-reports";
import type { FaqItem } from "@/types/marketing";

type ChildReportsProps = {
  childName: string;
};

/**
 * Relatórios mockados do filho — paridade visual com
 * layout_old/.../relatoriosView.php (título + meses + accordion-style1).
 */
export function ChildReports({ childName }: ChildReportsProps) {
  const [monthId, setMonthId] = useState(mockReportMonths[0]?.id ?? "");
  const selectedMonth =
    mockReportMonths.find((month) => month.id === monthId) ??
    mockReportMonths[0];

  const accordionItems: FaqItem[] = useMemo(() => {
    const label = selectedMonth?.label ?? "";
    const seed = monthId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    return mockReportSections.map((section, index) => ({
      id: section.id,
      question: section.title,
      answer: formatReportBody(section.body, label, seed + index * 3),
    }));
  }, [monthId, selectedMonth?.label]);

  return (
    <div className="blog-content">
      <div className="blog-meta">
        <h2 className="blog-title">Relatórios</h2>
      </div>
      <p>
        Acompanhe o progresso de <strong>{childName}</strong> no período
        selecionado.
      </p>
      <p className="mb-4">
        Período: <strong>{selectedMonth?.label ?? "—"}</strong>
      </p>

      <div className="widget widget_categories mb-4">
        <h3 className="widget_title">Meses anteriores</h3>
        <ul>
          {mockReportMonths.map((month) => {
            const isActive = month.id === monthId;
            return (
              <li
                key={month.id}
                className={isActive ? "current-menu-item" : undefined}
              >
                <a
                  href={`#relatorio-${month.id}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    setMonthId(month.id);
                  }}
                >
                  {month.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <FaqAccordion
        items={accordionItems}
        defaultOpenId={accordionItems[0]?.id}
        variant="content"
      />

      <p className="mt-4 mb-0">
        <Link href="/">← Voltar aos filhos</Link>
      </p>
    </div>
  );
}
