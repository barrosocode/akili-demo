export type SupportFaqActionType = "route" | "external_url";

export type SupportFaqRouteTarget =
  | "student_login"
  | "student_materials"
  | "guardian_signin"
  | "guardian_children"
  | "teacher_classrooms"
  | "teacher_literacy"
  | "school_students";

export interface SupportFaqTopicSummary {
  uuid: string;
  name: string;
  slug: string;
  description: string | null;
  position: number;
  faqs_count: number;
}

export interface SupportFaqListItem {
  uuid: string;
  title: string;
  position: number;
}

export interface SupportFaqTopicDetail {
  uuid: string;
  name: string;
  slug: string;
  description: string | null;
  position: number;
  faqs: SupportFaqListItem[];
}

export interface SupportFaqTopicRef {
  uuid: string;
  name: string;
  slug: string;
}

export interface SupportFaqAction {
  uuid: string;
  label: string;
  type: SupportFaqActionType;
  target: string;
  position: number;
}

export interface SupportFaqDetail {
  uuid: string;
  title: string;
  body: string;
  body_format: "html";
  position: number;
  topic: SupportFaqTopicRef;
  actions: SupportFaqAction[];
}

export interface SupportFaqSearchHit {
  uuid: string;
  title: string;
  position: number;
  topic: SupportFaqTopicRef;
}
