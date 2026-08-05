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

export type PerformanceLevel = "excellent" | "evolving" | "needs_support";

export interface ChildMaterial {
  packageUuid: string | null;
  packageName: string | null;
  subject: string | null;
  teacherName: string | null;
  percentComplete: number | null;
  lessonsTotal: number | null;
  lessonsCompleted: number | null;
  timeStudiedMinutes: number | null;
  lastActivityAt: string | null;
  nextLesson: string | null;
  performanceLevel: PerformanceLevel | string | null;
}

export interface ChildClassroom {
  name: string;
  code: string | null;
  status: string;
  teacher: {
    name: string | null;
    specialty: string | null;
  } | null;
}

export interface ChildSchool {
  name: string;
  city: string | null;
  state: string | null;
  gradeLabel: string | null;
  kind: string | null;
}

export interface ChildKpis {
  overallPercent?: number | null;
  studyStreakDays?: number | null;
  activitiesCompleted?: number | null;
  pendingLessons?: number | null;
  timeStudiedMinutes?: number | null;
  totalStudyMinutes?: number | null;
  averageScore?: number | null;
  monthlyEvolutionPercent?: number | null;
  weeklyEvolution?: number[];
}

export interface ChildReport {
  period: string;
  periodLabel: string;
  teacherName: string | null;
  subject: string | null;
  summary: string;
  skillsDeveloped: string[];
  skillsInDevelopment: string[];
  strengths: string[];
  difficulties: string[];
  recommendations: string[];
  issuedAt: string | null;
  performanceLevel: PerformanceLevel | string | null;
}

export interface GamificationBadge {
  key: string;
  name: string;
  icon: string;
  earnedAt: string | null;
}

export interface GamificationMission {
  title: string;
  progress: number;
  target: number;
  rewardXp: number;
  status: string;
}

export interface GamificationReward {
  title: string;
  unlockedAt: string | null;
}

export interface ChildGamification {
  xp: number;
  level: number;
  levelName: string;
  xpToNextLevel: number;
  streakDays: number;
  badges: GamificationBadge[];
  missions: GamificationMission[];
  rewards: GamificationReward[];
}

export interface ChildNotification {
  title: string;
  body: string;
  createdAt: string | null;
  type: string;
}

export interface UpcomingContent {
  title: string;
  subject: string | null;
  packageName: string | null;
  percentComplete: number | null;
  teacherName: string | null;
}

export interface ChildProgress {
  ref: string;
  name: string;
  status: "demo" | "stub" | string;
  message: string | null;
  summary: string | null;
  lastActivityAt: string | null;
  kpis: ChildKpis;
  materials: ChildMaterial[];
  reports: ChildReport[];
  school: ChildSchool | null;
  classrooms: ChildClassroom[];
  gamification: ChildGamification | null;
  notifications: ChildNotification[];
  upcomingContent: UpcomingContent[];
}
