import {
  isLearningSessionKind,
  type LearningSessionKind,
} from "@/types/student-learning";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function parseStudyTaskUuidParam(
  value: string | null | undefined
): string | undefined {
  if (!value || !UUID_RE.test(value)) return undefined;
  return value;
}

export function parseSessionKindParam(
  value: string | null | undefined
): LearningSessionKind | undefined {
  if (!value || !isLearningSessionKind(value)) return undefined;
  return value;
}

export function learningSessionCurrentSearchParams(requestUrl: string): string {
  const url = new URL(requestUrl);
  const params = new URLSearchParams();
  const studyTaskUuid = parseStudyTaskUuidParam(
    url.searchParams.get("study_task_uuid")
  );
  const sessionKind = parseSessionKindParam(url.searchParams.get("session_kind"));
  if (studyTaskUuid) params.set("study_task_uuid", studyTaskUuid);
  if (sessionKind) params.set("session_kind", sessionKind);
  return params.toString();
}

export function learningSessionCurrentQuery(options: {
  studyTaskUuid?: string;
  sessionKind?: LearningSessionKind;
}): string {
  const params = new URLSearchParams();
  if (options.studyTaskUuid) params.set("study_task_uuid", options.studyTaskUuid);
  if (options.sessionKind) params.set("session_kind", options.sessionKind);
  const query = params.toString();
  return query ? `?${query}` : "";
}
