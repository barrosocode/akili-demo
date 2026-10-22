"use client";

import { ArrowRight, ChartColumn } from "lucide-react";
import Link from "next/link";
import { useId, useMemo, type ReactNode } from "react";

import { resolveSubjectColor } from "@/features/subjects/lib/subject-color";
import { resolveSubjectIcon } from "@/features/subjects/lib/subject-icons";
import {
  selectSubjectProgress,
  type SubjectProgressMode,
} from "@/features/subjects/lib/select-subject-progress";
import type { SubjectProgressItem } from "@/types/student-learning";

type SubjectProgressListProps = {
  items: SubjectProgressItem[] | null | undefined;
  mode?: SubjectProgressMode;
  detailsHref?: string;
  title?: string;
  hrefFor?: (item: SubjectProgressItem) => string;
};

type SubjectProgressNoticeProps = {
  title?: string;
  message: string;
  tone?: "status" | "alert";
};

function roundedPercent(percent: number): number {
  if (!Number.isFinite(percent)) return 0;
  return Math.round(percent);
}

function barWidth(percent: number): number {
  return Math.min(100, Math.max(0, roundedPercent(percent)));
}

function wholeCount(value: number): number {
  return Number.isInteger(value) ? value : 0;
}

function ProgressCard({
  title,
  detailsHref,
  children,
  tone,
}: {
  title: string;
  detailsHref?: string;
  children: ReactNode;
  tone?: "status" | "alert";
}) {
  const titleId = useId();
  const hasTitle = title.length > 0;

  return (
    <section
      className="subject-progress"
      aria-labelledby={hasTitle ? titleId : undefined}
      role={tone === "alert" ? "alert" : tone === "status" ? "status" : undefined}
    >
      {hasTitle ? (
        <div className="subject-progress__header">
          <div className="subject-progress__heading">
            <ChartColumn className="subject-progress__mark" size={18} aria-hidden="true" />
            <h2 id={titleId} className="subject-progress__title">
              {title}
            </h2>
          </div>
          {detailsHref ? (
            <Link href={detailsHref} className="subject-progress__details">
              Ver detalhes
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function SubjectProgressNotice({
  title = "Meu progresso",
  message,
  tone = "status",
}: SubjectProgressNoticeProps) {
  return (
    <ProgressCard title={title} tone={tone}>
      <p className="subject-progress__message">{message}</p>
    </ProgressCard>
  );
}

function ProgressRowContent({ item }: { item: SubjectProgressItem }) {
  const color = resolveSubjectColor(item.subject.color);
  const Icon = resolveSubjectIcon(item.subject.icon);
  const percentLabel = roundedPercent(item.percent);
  const width = barWidth(item.percent);
  const completed = wholeCount(item.materials_completed);
  const total = wholeCount(item.materials_total);

  return (
    <>
      <span className="subject-progress__icon" style={{ backgroundColor: color }} aria-hidden="true">
        <Icon size={20} strokeWidth={2} color="#ffffff" />
      </span>
      <div className="subject-progress__body">
        <p className="subject-progress__name">{item.subject.name}</p>
        <div
          className="subject-progress__track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={width}
          aria-label={`Progresso em ${item.subject.name}`}
        >
          <div
            className="subject-progress__fill"
            style={{ width: `${width}%`, backgroundColor: color }}
          />
        </div>
      </div>
      <div className="subject-progress__stats">
        <strong className="subject-progress__percent">{percentLabel}%</strong>
        <span className="subject-progress__fraction">
          {completed} / {total}
        </span>
      </div>
    </>
  );
}

function ProgressRow({
  item,
  href,
}: {
  item: SubjectProgressItem;
  href?: string;
}) {
  const destination = href?.trim();

  if (!destination) {
    return (
      <li className="subject-progress__row">
        <ProgressRowContent item={item} />
      </li>
    );
  }

  return (
    <li className="subject-progress__row subject-progress__row--link">
      <Link
        href={destination}
        className="subject-progress__link"
        aria-label={`${item.subject.name}, ${roundedPercent(item.percent)}%`}
      >
        <ProgressRowContent item={item} />
      </Link>
    </li>
  );
}

export function SubjectProgressList({
  items,
  mode = "preview",
  detailsHref,
  title = "Meu progresso",
  hrefFor,
}: SubjectProgressListProps) {
  const rows = useMemo(() => selectSubjectProgress(items, mode), [items, mode]);
  const link = mode === "preview" && rows.length > 0 ? detailsHref?.trim() : undefined;

  return (
    <ProgressCard title={title} detailsHref={link || undefined}>
      {rows.length === 0 ? (
        <p className="subject-progress__message">Nenhuma disciplina com conteúdo ainda.</p>
      ) : (
        <ul className="subject-progress__items">
          {rows.map((item) => (
            <ProgressRow key={item.subject.uuid} item={item} href={hrefFor?.(item)} />
          ))}
        </ul>
      )}
    </ProgressCard>
  );
}
