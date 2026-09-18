export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  profile: {
    all: ["profile"] as const,
    me: () => [...queryKeys.profile.all, "me"] as const,
  },
  children: {
    all: ["children"] as const,
    list: () => [...queryKeys.children.all, "list"] as const,
    progress: (ref: string) =>
      [...queryKeys.children.all, "progress", ref] as const,
    learning: (ref: string) =>
      [...queryKeys.children.all, "learning", ref] as const,
    learningKpi: (ref: string, filters: string) =>
      [...queryKeys.children.all, "learning-kpi", ref, filters] as const,
    learningChart: (ref: string, series: string, filters: string) =>
      [...queryKeys.children.all, "learning-chart", ref, series, filters] as const,
  },
  purchases: {
    all: ["purchases"] as const,
    list: () => [...queryKeys.purchases.all, "list"] as const,
  },
  demo: {
    all: ["demo"] as const,
    personas: ["demo", "personas"] as const,
  },
  studentStudyBoard: {
    all: ["student", "study-board"] as const,
    board: () => [...queryKeys.studentStudyBoard.all, "board"] as const,
    currentPlan: () =>
      [...queryKeys.studentStudyBoard.all, "study-plan", "current"] as const,
  },
  guardianStudyPlanner: {
    all: ["guardian", "study-planner"] as const,
    board: (ref: string) =>
      [...queryKeys.guardianStudyPlanner.all, "board", ref] as const,
    settings: (ref: string) =>
      [...queryKeys.guardianStudyPlanner.all, "settings", ref] as const,
    availability: (ref: string) =>
      [...queryKeys.guardianStudyPlanner.all, "availability", ref] as const,
    schoolSchedule: (ref: string) =>
      [...queryKeys.guardianStudyPlanner.all, "school-schedule", ref] as const,
    currentPlan: (ref: string) =>
      [...queryKeys.guardianStudyPlanner.all, "study-plan", "current", ref] as const,
    plan: (ref: string, planUuid: string) =>
      [...queryKeys.guardianStudyPlanner.all, "study-plan", ref, planUuid] as const,
    plans: (ref: string, page: number) =>
      [...queryKeys.guardianStudyPlanner.all, "study-plans", ref, page] as const,
    learning: (ref: string) =>
      [...queryKeys.guardianStudyPlanner.all, "learning", ref] as const,
  },
  studyKanban: {
    all: ["study-kanban"] as const,
    studentColumn: (status: string) =>
      [...queryKeys.studyKanban.all, "student", status] as const,
    guardianColumn: (ref: string, status: string) =>
      [...queryKeys.studyKanban.all, "guardian", ref, status] as const,
  },
};
