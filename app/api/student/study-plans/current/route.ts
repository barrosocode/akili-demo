import { jsonError, jsonSuccess } from "@/lib/api/response";
import { studentLaravelResourceNullable } from "@/lib/api/student-laravel-client";
import type { StudentStudyPlanCurrent } from "@/types/student-study-board";

export async function GET() {
  try {
    const studyPlan = await studentLaravelResourceNullable<StudentStudyPlanCurrent>(
      "/mobile/student/study-plans/current",
      "study_plan"
    );
    return jsonSuccess(studyPlan);
  } catch (error) {
    return jsonError(error);
  }
}
