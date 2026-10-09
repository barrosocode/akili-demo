export type StudyTaskStatus = "backlog" | "todo" | "doing" | "done";
export type StudyTaskKind =
  | "new_content"
  | "review_r1"
  | "review_r2"
  | "review_r3";

export interface StudyTask {
  uuid: string;
  kind: StudyTaskKind;
  name: string;
  status: StudyTaskStatus;
  position: number;
  scheduled_on: string | null;
  scheduled_start: string | null;
  scheduled_end: string | null;
  duration_minutes: number;
  compacted_review: boolean;
  is_weekend: boolean;
  source: "system";
  content_uuid: string | null;
  subject_uuid: string | null;
  topic_uuid: string | null;
  origin_task_uuid: string | null;
  study_plan_uuid: string | null;
  started_at: string | null;
  completed_at: string | null;
}

export const STUDY_TASK_STATUSES: StudyTaskStatus[] = [
  "backlog",
  "todo",
  "doing",
  "done",
];
