import { bffClient } from "@/services/bff/client";
import type {
  AvailabilitySlot,
  CatalogSubject,
  GuardianStudySetting,
  PaginatedList,
  SchoolScheduleSlot,
  StudyPlanDetail,
  StudyPlanGenerateInput,
  StudyPlanSummary,
} from "@/types/guardian-study-planner";
import type { StudentBoard } from "@/types/student-study-board";
import type { StudentDashboard } from "@/types/student-learning";
import type { StudyTask } from "@/types/study-task";

export const guardianStudyPlannerBff = {
  board(ref: string) {
    return bffClient<StudentBoard>(`/api/guardian/children/${ref}/board`);
  },

  settings(ref: string) {
    return bffClient<GuardianStudySetting>(
      `/api/guardian/children/${ref}/study-settings`
    );
  },

  putSettings(ref: string, body: Omit<GuardianStudySetting, "uuid">) {
    return bffClient<GuardianStudySetting>(
      `/api/guardian/children/${ref}/study-settings`,
      { method: "PUT", body }
    );
  },

  availability(ref: string) {
    return bffClient<PaginatedList<AvailabilitySlot>>(
      `/api/guardian/children/${ref}/availability-slots?page=1&page_size=100`
    );
  },

  putAvailability(ref: string, availability_slots: AvailabilitySlot[]) {
    return bffClient<PaginatedList<AvailabilitySlot>>(
      `/api/guardian/children/${ref}/availability-slots`,
      { method: "PUT", body: { availability_slots } }
    );
  },

  schoolSchedule(ref: string) {
    return bffClient<PaginatedList<SchoolScheduleSlot>>(
      `/api/guardian/children/${ref}/school-schedule?page=1&page_size=100`
    );
  },

  putSchoolSchedule(ref: string, school_schedule_slots: SchoolScheduleSlot[]) {
    return bffClient<PaginatedList<SchoolScheduleSlot>>(
      `/api/guardian/children/${ref}/school-schedule`,
      { method: "PUT", body: { school_schedule_slots } }
    );
  },

  plans(ref: string, page = 1) {
    return bffClient<PaginatedList<StudyPlanSummary>>(
      `/api/guardian/children/${ref}/study-plans?page=${page}&page_size=15`
    );
  },

  currentPlan(ref: string) {
    return bffClient<StudyPlanDetail | null>(
      `/api/guardian/children/${ref}/study-plans/current`
    );
  },

  plan(ref: string, planUuid: string) {
    return bffClient<StudyPlanDetail>(
      `/api/guardian/children/${ref}/study-plans/${planUuid}`
    );
  },

  generate(ref: string, body: StudyPlanGenerateInput) {
    return bffClient<StudyPlanDetail>(
      `/api/guardian/children/${ref}/study-plans`,
      { method: "POST", body }
    );
  },

  learning(ref: string) {
    return bffClient<StudentDashboard>(`/api/guardian/children/${ref}/learning`);
  },

  subjects() {
    return bffClient<CatalogSubject[]>("/api/guardian/subjects");
  },

  tasks(ref: string, status: string, page: number) {
    const params = new URLSearchParams({
      status,
      page: String(page),
      page_size: "50",
    });
    return bffClient<PaginatedList<StudyTask>>(
      `/api/guardian/children/${ref}/board/tasks?${params.toString()}`
    );
  },
};
