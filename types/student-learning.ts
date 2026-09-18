export type ContentPageTopicItem = {
  type: "topic";
  order: number;
  title: string;
  text: string;
  image?: string | null;
};

export type ContentPageActionItem = {
  type: "action";
  order: number;
  item: string;
  action_text?: string | null;
  read_text?: string | null;
};

export type ContentPageItem = ContentPageTopicItem | ContentPageActionItem;

export type ContentPage = {
  title: string;
  text: string;
  top_image?: string | null;
  items: ContentPageItem[];
};

export type ContentQuestionOption = {
  uuid?: string;
  text: string;
  is_correct: boolean;
  action?: string | null;
};

export type ContentQuestion = {
  uuid?: string;
  text: string;
  image?: string | null;
  hint?: string | null;
  explanation?: string | null;
  question_type?: string;
  expected_time?: number;
  difficulty_id?: string;
  options: ContentQuestionOption[];
};

export type LearningSessionStatus =
  | "started"
  | "in_progress"
  | "completed"
  | "abandoned";

export type ActivityAttemptStatus = "in_progress" | "completed" | "abandoned";

export type LearningSessionKind =
  | "new_content"
  | "review_r1"
  | "review_r2"
  | "review_r3";

export type ActivityTabId = "conf" | "r1" | "r2" | "r3" | "desafio";

export function isLearningSessionKind(
  value: string | null | undefined
): value is LearningSessionKind {
  return (
    value === "new_content" ||
    value === "review_r1" ||
    value === "review_r2" ||
    value === "review_r3"
  );
}

export type ActivityAttempt = {
  uuid: string;
  tab_id: ActivityTabId;
  attempt_number: number;
  status: ActivityAttemptStatus;
  accuracy_rate: number | null;
  error_rate: number | null;
  started_at: string | null;
  completed_at: string | null;
};

export type ActivityResponseSummary = {
  uuid: string;
  question_uuid: string;
  selected_option_uuid: string | null;
  is_correct: boolean;
  sequence_in_attempt: number;
  sequence_in_session: number;
  tab_id: ActivityTabId;
  response_time_ms: number;
  hint_used: boolean;
  attempted_at: string | null;
};

export type LearningSession = {
  uuid: string;
  status: LearningSessionStatus;
  session_kind: LearningSessionKind;
  visible_tabs: string[];
  study_task_uuid: string | null;
  shuffle_seed: number;
  content_uuid: string | null;
  content_version_uuid: string;
  started_at: string | null;
  completed_at: string | null;
  duration_seconds: number;
  attempts: ActivityAttempt[];
  responses: ActivityResponseSummary[];
};

export type StartLearningSessionRequest = {
  content_version_uuid: string;
  study_task_uuid?: string;
  metadata?: {
    study_task_uuid?: string;
  };
};

export type CompleteLearningSessionRequest = {
  status: Extract<LearningSessionStatus, "completed" | "abandoned">;
  duration_seconds?: number;
};

export type StartActivityAttemptRequest = {
  tab_id: ActivityTabId;
};

export type CompleteActivityAttemptRequest = {
  status: Extract<ActivityAttemptStatus, "completed" | "abandoned">;
  duration_seconds?: number;
};

export type RecordActivityResponseRequest = {
  event_uuid: string;
  question_uuid: string;
  selected_option_uuid: string;
  response_time_ms: number;
  sequence_in_attempt?: number;
  sequence_in_session?: number;
  hint_used?: boolean;
  attempted_at?: string;
};

export type StudentFrequency = {
  available_count: number;
  viewed_count: number;
  pending_count: number;
  viewed_percent: number;
};

export type StudentMaterialProgress = {
  status: string;
  percent_complete: number;
  last_page_index: number;
  time_studied_seconds: number;
  last_activity_at: string | null;
  completed_at: string | null;
};

export type StudentMaterial = {
  package: { uuid: string; name: string; slug: string };
  entitlement_uuid: string;
  content: {
    uuid: string;
    name: string;
    activity_type: string;
    subject: { uuid: string; name: string } | null;
    topic: { uuid: string; name: string } | null;
  };
  content_version_uuid: string;
  position: number;
  is_required: boolean;
  lesson_count: number;
  activity_count: number;
  progress: StudentMaterialProgress;
  school: { uuid: string; name: string } | null;
  classroom: { uuid: string; name: string } | null;
  teacher: { name: string | null; specialty: string | null } | null;
};

export type StudentPortalSession = {
  user: {
    uuid: string;
    name: string;
    email: string;
    profile_photo_url: string | null;
    type: string;
    status: string;
  };
  student: {
    uuid: string;
    name: string;
    preferred_name: string | null;
    status: string;
  };
  school: { uuid: string; name: string } | null;
  classroom: { uuid: string; name: string } | null;
  teacher: { name: string | null; specialty: string | null } | null;
  grade_label: string | null;
  materials_count: number;
};

export type StudentDashboard = {
  kpis: {
    overall_percent: number;
    materials_available: number;
    materials_completed: number;
    materials_in_progress: number;
    time_studied_seconds: number;
    activities_completed: number;
  };
  continue_studying: StudentMaterial | null;
  next_activity: StudentMaterial | null;
  school: { uuid: string; name: string } | null;
  classroom: { uuid: string; name: string } | null;
  teacher: { name: string | null; specialty: string | null } | null;
  materials: StudentMaterial[];
  read_only?: boolean;
  supervision_mode?: boolean;
  student?: { uuid: string; name: string };
};

export type PlaybackAction = {
  uuid: string;
  name: string;
  path: string;
};

export type ContentPlayback = {
  read_only: boolean;
  content: {
    uuid: string;
    name: string;
    activity_type: string;
    subject: { uuid: string; name: string } | null;
    series: { uuid: string; name: string } | null;
    topic: { uuid: string; name: string; code?: string | null } | null;
  };
  version: {
    uuid: string;
    version: number;
    pages: ContentPage[];
    questions: ContentQuestion[];
    metadata: Record<string, unknown>;
  };
  actions?: Record<string, PlaybackAction>;
  material: StudentMaterial | null;
};

export type StudentProgressUpdateRequest = {
  content_version_uuid: string;
  percent_complete?: number;
  last_page_index?: number;
  time_studied_seconds_delta?: number;
  mark_completed?: boolean;
  metadata?: Record<string, unknown>;
};

export type StudentProgressUpdate = {
  uuid: string;
  content_uuid: string;
  status: string;
  percent_complete: number;
  last_page_index: number;
  time_studied_seconds: number;
  last_activity_at: string | null;
  completed_at: string | null;
};
