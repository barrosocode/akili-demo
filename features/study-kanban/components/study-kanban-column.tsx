"use client";

import { StudyKanbanCard } from "@/features/study-kanban/components/study-kanban-card";
import { KANBAN_COLUMN_LABELS } from "@/features/study-kanban/lib/labels";
import { getUserFacingApiMessage } from "@/lib/api/errors";
import { BffClientError } from "@/services/bff/client";
import { useStudyKanbanColumnQuery } from "@/services/queries/study-kanban.queries";
import type { StudyTask, StudyTaskStatus } from "@/types/study-task";

type StudyKanbanColumnProps = {
  status: StudyTaskStatus;
  source: "student" | "guardian";
  childRef?: string;
  enabled?: boolean;
  hrefForTask: (task: StudyTask) => string | null;
  onOpenDetails?: (task: StudyTask) => void;
  actionLabel: string;
};

export function StudyKanbanColumn({
  status,
  source,
  childRef,
  enabled = true,
  hrefForTask,
  onOpenDetails,
  actionLabel,
}: StudyKanbanColumnProps) {
  const column =
    source === "guardian"
      ? ({ source: "guardian" as const, childRef: childRef ?? "" })
      : ({ source: "student" as const });

  const query = useStudyKanbanColumnQuery(
    column,
    status,
    enabled && (source === "student" || Boolean(childRef))
  );

  return (
    <section
      className="widget study-kanban-column mb-0"
      aria-label={KANBAN_COLUMN_LABELS[status]}
    >
      <div className="study-kanban-column__header">
        <h3 className="widget_title mb-0">{KANBAN_COLUMN_LABELS[status]}</h3>
        <span className="small text-muted">{query.tasks.length}</span>
      </div>

      {query.isLoading && query.tasks.length === 0 ? (
        <p role="status">Carregando...</p>
      ) : null}

      {query.error && query.tasks.length === 0 ? (
        <p className="text-danger" role="alert">
          {query.error instanceof BffClientError
            ? (query.error.detail ?? query.error.title)
            : getUserFacingApiMessage(query.error)}
        </p>
      ) : null}

      {!query.isLoading && !query.error && query.tasks.length === 0 ? (
        <p className="text-muted mb-0">Nenhum card nesta coluna.</p>
      ) : null}

      <div className="study-kanban-column__list">
        {query.tasks.map((task) => (
          <StudyKanbanCard
            key={task.uuid}
            task={task}
            href={onOpenDetails ? null : hrefForTask(task)}
            onOpenDetails={onOpenDetails}
            actionLabel={actionLabel}
          />
        ))}
      </div>

      {query.hasNextPage ? (
        <button
          type="button"
          className="vs-btn style3 mt-2"
          onClick={() => void query.fetchNextPage()}
          disabled={query.isFetchingNextPage}
        >
          {query.isFetchingNextPage ? "Carregando..." : "Carregar mais"}
        </button>
      ) : null}
    </section>
  );
}
