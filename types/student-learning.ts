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

export type ContentQuestion = {
  text: string;
  image?: string | null;
  hint?: string | null;
  explanation?: string | null;
  question_type?: string;
  options: Array<{
    text: string;
    is_correct: boolean;
    action?: string | null;
  }>;
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

export type ContentPlayback = {
  read_only: boolean;
  content: {
    uuid: string;
    name: string;
    activity_type: string;
    subject: { uuid: string; name: string } | null;
    series: { uuid: string; name: string } | null;
    topic: { uuid: string; name: string } | null;
  };
  version: {
    uuid: string;
    version: number;
    pages: ContentPage[];
    questions: ContentQuestion[];
    metadata: Record<string, unknown>;
  };
  material: StudentMaterial | null;
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
