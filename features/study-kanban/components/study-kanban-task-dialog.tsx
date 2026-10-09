"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  buildStudyTaskLog,
  formatStudyTaskSchedule,
} from "@/features/study-kanban/lib/timeline";
import {
  KANBAN_COLUMN_LABELS,
  STUDY_TASK_KIND_LABELS,
} from "@/features/study-kanban/lib/labels";
import type { StudyTask } from "@/types/study-task";

type StudyKanbanTaskDialogProps = {
  task: StudyTask;
  onClose: () => void;
};

export function StudyKanbanTaskDialog({
  task,
  onClose,
}: StudyKanbanTaskDialogProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const log = buildStudyTaskLog(task);
  const schedule = formatStudyTaskSchedule(task);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className="marketing-root">
      <div className="study-kanban-dialog-backdrop" onClick={onClose}>
        <div
          className="widget study-kanban-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="study-kanban-dialog__header">
            <h2 id={titleId} className="widget_title mb-0">
              {task.name}
            </h2>
            <button
              ref={closeRef}
              type="button"
              className="vs-btn style3"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>

          <div className="study-kanban-dialog__chips" aria-label="Situação do card">
            <span className="portal-chip portal-chip--theme">
              {KANBAN_COLUMN_LABELS[task.status]}
            </span>
            <span className="portal-chip portal-chip--muted">
              {STUDY_TASK_KIND_LABELS[task.kind]}
            </span>
            {task.compacted_review ? (
              <span className="portal-chip portal-chip--muted">Revisão compactada</span>
            ) : null}
            {task.is_weekend ? (
              <span className="portal-chip portal-chip--muted">Fim de semana</span>
            ) : null}
          </div>

          {schedule ? <p className="mb-3">{schedule}</p> : null}

          <h3 className="study-kanban-dialog__log-title">Histórico</h3>
          <ol className="study-kanban-log">
            {log.map((item) => (
              <li key={`${item.title}-${item.detail}`}>
                <strong>{item.title}</strong>
                <span>{item.detail}</span>
              </li>
            ))}
          </ol>

          <p className="small text-muted mb-0 mt-3">
            Você acompanha o andamento daqui. O estudo acontece no quadro do aluno.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
