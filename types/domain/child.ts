export interface ChildSummary {
  ref: string;
  name: string;
  avatarUrl: string | null;
  friendlyCode: string | null;
  gradeLabel: string | null;
  schoolName: string | null;
  canViewProgress: boolean;
  canPurchase: boolean;
}

export interface ChildProgress {
  ref: string;
  name: string;
  summary: string | null;
  lastActivityAt: string | null;
}
