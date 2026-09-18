import type { StudyTaskStatus } from "@/types/study-task";

export function studyTasksSearchParams(
  requestUrl: string,
  defaults?: { pageSize?: string }
): string {
  const url = new URL(requestUrl);
  const page = url.searchParams.get("page") ?? "1";
  const pageSize = url.searchParams.get("page_size") ?? defaults?.pageSize ?? "50";
  const status = url.searchParams.get("status");
  const kind = url.searchParams.get("kind");
  const scheduledOn = url.searchParams.get("scheduled_on");

  const params = new URLSearchParams({
    page,
    page_size: pageSize,
  });
  if (status) params.set("status", status);
  if (kind) params.set("kind", kind);
  if (scheduledOn) params.set("scheduled_on", scheduledOn);
  return params.toString();
}

export function isStudyTaskStatus(value: string | null): value is StudyTaskStatus {
  return (
    value === "backlog" ||
    value === "todo" ||
    value === "doing" ||
    value === "done"
  );
}
