export type SupportFaqActionType = "route" | "external_url";

export type SupportFaqRouteTarget =
  | "student_login"
  | "student_materials"
  | "guardian_signin"
  | "guardian_first_access"
  | "guardian_forgot_password"
  | "guardian_children"
  | "guardian_profile"
  | "guardian_reports"
  | "teacher_classrooms"
  | "teacher_literacy"
  | "teacher_messages"
  | "school_students"
  | "school_teachers"
  | "school_guardians"
  | "school_classrooms"
  | "school_licenses"
  | "admin_dashboard"
  | "admin_contratantes"
  | "admin_users"
  | "admin_roles"
  | "admin_permissions"
  | "admin_profile"
  | "admin_contents"
  | "admin_subjects"
  | "admin_packages"
  | "admin_modules"
  | "admin_literacy_contents"
  | "admin_literacy_modules"
  | "admin_learning_skills"
  | "admin_lgpd_documents"
  | "admin_lgpd_acceptances"
  | "admin_support_faq"
  | "admin_choose_school";

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
