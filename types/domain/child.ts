export interface ChildSummary {
  ref: string;
  name: string;
  avatarUrl: string | null;
  status: string;
  friendlyCode: string | null;
  gradeLabel: string | null;
  classroomName: string | null;
  schoolName: string | null;
  canViewProgress: boolean;
  canPurchase: boolean;
  accessible: boolean;
}

export interface ChildProgress {
  ref: string;
  name: string;
  summary: string | null;
  lastActivityAt: string | null;
}
