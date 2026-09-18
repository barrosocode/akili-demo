import type { EnvelopePagination } from "@/lib/api/envelope";
import type { BoardStatus, StudyPlanStatus } from "@/types/student-study-board";

export type WeekdayIso = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export type ReviewModel = "dehaene" | "leitner" | "custom";
export type DifficultyLevel = "N1" | "N2" | "N3" | "N4" | "N5";
export type OmittedTopicReason =
  | "NO_PUBLISHED_CONTENT"
  | "NO_ENTITLEMENT"
  | "TOPIC_NOT_FOUND";

export type GuardianBoardSummary = {
  uuid: string;
  name: string;
  status: BoardStatus;
  student_uuid: string;
  student_name: string;
  created_at: string | null;
};

export type GuardianStudySetting = {
  uuid: string | null;
  inverted_classroom: boolean;
  spaced_review: boolean;
  review_model: ReviewModel;
  items_per_session: number | null;
  tdah_adjustment: boolean;
  on_medication: boolean;
};

export type AvailabilitySlot = {
  uuid?: string;
  weekday: WeekdayIso;
  starts_at: string;
  ends_at: string;
  is_recurring: boolean;
  exception_dates: string[];
};

export type SchoolScheduleSlot = {
  uuid?: string;
  weekday: WeekdayIso;
  subject_uuid: string;
  subject_name?: string | null;
};

export type StudyPlanExam = {
  date: string;
  subject_uuids: string[];
};

export type StudyPlanTopicInput = {
  topic_uuid: string;
  difficulty_level: DifficultyLevel;
  needs_reinforcement: boolean;
};

export type StudyPlanGenerateInput = {
  starts_on: string;
  content_deadline_on: string;
  blocked_dates: string[];
  exams: StudyPlanExam[];
  topics: StudyPlanTopicInput[];
};

export type StudyPlanWarning = {
  code: string;
  message: string;
  action_taken: string;
};

export type OmittedTopic = {
  code: string;
  reason: OmittedTopicReason;
};

export type StudyPlanTopicDetail = {
  uuid: string;
  topic_uuid: string;
  subject_uuid: string | null;
  content_uuid: string | null;
  difficulty_level: DifficultyLevel;
  already_studied: boolean;
  needs_reinforcement: boolean;
};

export type StudyPlanSummary = {
  uuid: string;
  status: StudyPlanStatus;
  starts_on: string;
  content_deadline_on: string;
  engine_version: string | null;
  warnings_count: number;
  omitted_topics_count: number;
  generated_at: string | null;
  applied_at: string | null;
  created_at: string | null;
};

export type StudyPlanDetail = StudyPlanSummary & {
  blocked_dates: string[];
  exams: StudyPlanExam[];
  omitted_topics: OmittedTopic[];
  warnings: StudyPlanWarning[];
  weekend_simulation: unknown;
  error_code: string | null;
  topics: StudyPlanTopicDetail[];
  task_count: number;
};

export type PaginatedList<T> = {
  items: T[];
  pagination: EnvelopePagination | null;
};

export type CatalogSubject = {
  uuid: string;
  name: string;
};

export type CatalogTopic = {
  uuid: string;
  name: string;
  subjectName: string | null;
};
