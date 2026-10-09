import type { StudyTaskKind, StudyTaskStatus } from "@/types/study-task";

export const KANBAN_COLUMN_LABELS: Record<StudyTaskStatus, string> = {
  backlog: "Roteiro",
  todo: "Hoje",
  doing: "Em estudo",
  done: "Concluído",
};

export const STUDY_TASK_KIND_LABELS: Record<StudyTaskKind, string> = {
  new_content: "Conteúdo novo",
  review_r1: "Revisão 1",
  review_r2: "Revisão 2",
  review_r3: "Revisão 3",
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function parseStudyTaskParam(value: string | null | undefined): string | undefined {
  if (!value || !UUID_RE.test(value)) return undefined;
  return value;
}

export function canStartStudyTask(task: {
  content_uuid: string | null;
  status: StudyTaskStatus;
  scheduled_on: string | null;
}): boolean {
  if (!task.content_uuid) return false;
  if (task.status === "todo" || task.status === "doing") return true;
  return task.status === "backlog" && task.scheduled_on == null;
}

export function studentTaskHref(
  contentUuid: string,
  taskUuid: string,
  kind: StudyTaskKind
): string {
  const params = new URLSearchParams({
    studyTask: taskUuid,
    kind,
  });
  return `/aluno/materiais/${contentUuid}?${params.toString()}`;
}
