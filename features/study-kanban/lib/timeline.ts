import {
  formatStudyCalendarDate,
  formatStudyDateTime,
} from "@/features/study-board/lib/format-study-date";
import { KANBAN_COLUMN_LABELS } from "@/features/study-kanban/lib/labels";
import type { StudyTask } from "@/types/study-task";

export type StudyTaskLogItem = {
  title: string;
  detail: string;
};

function formatClock(value: string): string {
  return value.slice(0, 5);
}

function formatTimeRange(task: StudyTask): string | null {
  if (task.scheduled_start && task.scheduled_end) {
    return `${formatClock(task.scheduled_start)} – ${formatClock(task.scheduled_end)}`;
  }
  if (task.scheduled_start) return formatClock(task.scheduled_start);
  return null;
}

export function formatStudyTaskSchedule(task: StudyTask): string {
  const date = task.scheduled_on
    ? formatStudyCalendarDate(task.scheduled_on)
    : null;
  const timeRange = formatTimeRange(task);
  const duration =
    task.duration_minutes > 0 ? `${task.duration_minutes} min` : null;

  return [date, timeRange, duration].filter(Boolean).join(" · ");
}

export function buildStudyTaskLog(task: StudyTask): StudyTaskLogItem[] {
  const items: StudyTaskLogItem[] = [
    {
      title: "Entrou no roteiro",
      detail:
        formatStudyTaskSchedule(task) ||
        (task.scheduled_on ? "" : "O aluno escolhe quando estudar."),
    },
  ];

  if (task.started_at) {
    items.push({
      title: "Começou a estudar",
      detail: formatStudyDateTime(task.started_at),
    });
  }

  if (task.completed_at) {
    items.push({
      title: "Concluiu a atividade",
      detail: formatStudyDateTime(task.completed_at),
    });
  } else if (task.status === "doing") {
    items.push({
      title: "Está nesta atividade agora",
      detail: "O card está em estudo. Ainda não há conclusão registrada.",
    });
  } else if (task.status === "todo") {
    items.push({
      title: "Esperando o estudo de hoje",
      detail: "O aluno ainda não abriu este card.",
    });
  } else if (task.status === "backlog") {
    items.push({
      title: `Na coluna ${KANBAN_COLUMN_LABELS[task.status]}`,
      detail: task.scheduled_on
        ? "Ainda não chegou o dia combinado."
        : "O aluno escolhe quando estudar.",
    });
  }

  return items;
}
