export type BoardMemberRole = "owner" | "guardian";
export type BoardStatus = "active" | "archived";
export type StudyPlanStatus =
  | "pending"
  | "generating"
  | "applied"
  | "failed"
  | "superseded";

export interface BoardMember {
  user_uuid: string;
  name: string | null;
  member_role: BoardMemberRole;
}

export interface BoardStudyPlanEmbed {
  uuid: string;
  status: StudyPlanStatus;
  starts_on: string;
  content_deadline_on: string;
  warnings_count: number;
}

export interface StudentBoard {
  uuid: string;
  name: string;
  status: BoardStatus;
  student_uuid: string | null;
  school_uuid: string | null;
  members: BoardMember[];
  current_study_plan: BoardStudyPlanEmbed | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface StudentStudyPlanCurrent {
  uuid: string;
  status: StudyPlanStatus;
  starts_on: string;
  content_deadline_on: string;
  warnings_count?: number;
  task_count?: number;
  engine_version?: string | null;
  generated_at?: string | null;
  applied_at?: string | null;
  created_at?: string | null;
}
