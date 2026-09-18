"use client";

import { useState } from "react";

import { StudyKanbanColumn } from "@/features/study-kanban/components/study-kanban-column";
import { StudyKanbanTaskDialog } from "@/features/study-kanban/components/study-kanban-task-dialog";
import {
  canStartStudyTask,
  studentTaskHref,
} from "@/features/study-kanban/lib/labels";
import { STUDY_TASK_STATUSES, type StudyTask } from "@/types/study-task";

type StudyKanbanBoardProps = {
  readOnly?: boolean;
  childRef?: string;
  enabled?: boolean;
};

export function StudyKanbanBoard({
  readOnly = false,
  childRef,
  enabled = true,
}: StudyKanbanBoardProps) {
  const source = readOnly ? "guardian" : "student";
  const [selectedTask, setSelectedTask] = useState<StudyTask | null>(null);

  function hrefForTask(task: StudyTask): string | null {
    if (readOnly || !canStartStudyTask(task) || !task.content_uuid) return null;
    return studentTaskHref(task.content_uuid, task.uuid, task.kind);
  }

  return (
    <>
      <div id="quadro" className="study-kanban-wrap mb-4">
        <div className="study-kanban">
          {STUDY_TASK_STATUSES.map((status) => (
            <StudyKanbanColumn
              key={status}
              status={status}
              source={source}
              childRef={childRef}
              enabled={enabled}
              hrefForTask={hrefForTask}
              onOpenDetails={readOnly ? setSelectedTask : undefined}
              actionLabel={readOnly ? "Ver detalhes" : "Estudar"}
            />
          ))}
        </div>
      </div>

      {selectedTask ? (
        <StudyKanbanTaskDialog
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      ) : null}
    </>
  );
}
