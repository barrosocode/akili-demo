"use client";

import Link from "next/link";
import { useId, useMemo, type ReactNode } from "react";

import { resolveSubjectColor, subjectSurfaceColor } from "@/features/subjects/lib/subject-color";
import { resolveSubjectIcon } from "@/features/subjects/lib/subject-icons";
import type { SubjectListItem } from "@/types/subject-catalog";

type SubjectListProps = {
  subjects: SubjectListItem[];
  title?: string;
  renderAction?: (subject: SubjectListItem) => ReactNode;
  hrefFor?: (subject: SubjectListItem) => string;
};

function SubjectIdentity({ subject }: { subject: SubjectListItem }) {
  const Icon = resolveSubjectIcon(subject.icon);

  return (
    <>
      <span
        className="subject-list__icon"
        aria-hidden="true"
        style={{ backgroundColor: resolveSubjectColor(subject.color) }}
      >
        <Icon size={22} strokeWidth={2} color="#ffffff" />
      </span>
      <span className="subject-list__name">{subject.name}</span>
    </>
  );
}

function prepareSubjects(subjects: SubjectListItem[]): SubjectListItem[] {
  const seen = new Set<string>();
  const unique: SubjectListItem[] = [];
  for (const subject of subjects) {
    if (seen.has(subject.uuid)) continue;
    seen.add(subject.uuid);
    unique.push(subject);
  }
  return unique.sort((left, right) => left.name.localeCompare(right.name, "pt-BR"));
}

export function SubjectList({
  subjects,
  title = "Minhas disciplinas",
  renderAction,
  hrefFor,
}: SubjectListProps) {
  const titleId = useId();
  const items = useMemo(() => prepareSubjects(subjects), [subjects]);
  const hasTitle = title.length > 0;

  return (
    <section
      className="subject-list"
      aria-labelledby={hasTitle ? titleId : undefined}
    >
      {hasTitle ? (
        <h2 id={titleId} className="subject-list__title">
          {title}
        </h2>
      ) : null}
      {items.length === 0 ? (
        <p className="subject-list__empty">Nenhuma disciplina disponível.</p>
      ) : (
        <ul className="subject-list__items">
          {items.map((subject) => {
            const surface = subjectSurfaceColor(subject.color);
            const href = hrefFor?.(subject);

            if (href) {
              return (
                <li key={subject.uuid} className="subject-list__row subject-list__row--linked">
                  <Link
                    href={href}
                    className="subject-list__link"
                    style={{ backgroundColor: surface }}
                  >
                    <SubjectIdentity subject={subject} />
                  </Link>
                </li>
              );
            }

            const action = renderAction?.(subject);

            return (
              <li
                key={subject.uuid}
                className="subject-list__row"
                style={{ backgroundColor: surface }}
              >
                <div className="subject-list__main">
                  <SubjectIdentity subject={subject} />
                </div>
                {action != null ? (
                  <div className="subject-list__action">{action}</div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
