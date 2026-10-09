"use client";

import Link from "next/link";

import { formatStudyTaskSchedule } from "@/features/study-kanban/lib/timeline";
import { STUDY_TASK_KIND_LABELS } from "@/features/study-kanban/lib/labels";
import type { StudyTask } from "@/types/study-task";

type StudyKanbanCardProps = {
  task: StudyTask;
  href?: string | null;
  onOpenDetails?: (task: StudyTask) => void;
  actionLabel: string;
};

export function StudyKanbanCard({
  task,
  href = null,
  onOpenDetails,
  actionLabel,
}: StudyKanbanCardProps) {
  const schedule = formatStudyTaskSchedule(task);
  const body = (
    <div className="study-kanban-card__body">
      <span className="portal-chip portal-chip--muted">{STUDY_TASK_KIND_LABELS[task.kind]}</span>
      <strong className="study-kanban-card__title">{task.name}</strong>
      {schedule ? <p className="small mb-0">{schedule}</p> : null}
      {task.compacted_review ? (
        <p className="small mb-0">Revisão compactada</p>
      ) : null}
    </div>
  );

  if (onOpenDetails) {
    return (
      <article className="study-kanban-card">
        <button
          type="button"
          className="study-kanban-card__link"
          aria-haspopup="dialog"
          onClick={() => onOpenDetails(task)}
        >
          {body}
          <span className="study-kanban-card__action">{actionLabel}</span>
        </button>
      </article>
    );
  }

  if (!href) {
    return (
      <article className="study-kanban-card" aria-disabled="true">
        {body}
      </article>
    );
  }

  return (
    <article className="study-kanban-card">
      <Link href={href} className="study-kanban-card__link">
        {body}
        <span className="study-kanban-card__action">{actionLabel}</span>
      </Link>
    </article>
  );
}
