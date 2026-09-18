import { bffClient } from "@/services/bff/client";
import type { PaginatedList } from "@/types/guardian-study-planner";
import type {
  StudentBoard,
  StudentStudyPlanCurrent,
} from "@/types/student-study-board";
import type { StudyTask } from "@/types/study-task";

export const studentStudyBoardBff = {
  board() {
    return bffClient<StudentBoard>("/api/student/board");
  },

    currentPlan() {
    return bffClient<StudentStudyPlanCurrent | null>(
      "/api/student/study-plans/current"
    );
  },

  tasks(status: string, page: number) {
    const params = new URLSearchParams({
      status,
      page: String(page),
      page_size: "50",
    });
    return bffClient<PaginatedList<StudyTask>>(
      `/api/student/board/tasks?${params.toString()}`
    );
  },
};
