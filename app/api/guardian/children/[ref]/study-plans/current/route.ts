import { requireChildUuid } from "@/lib/api/guardian-child";
import { laravelResourceNullable } from "@/lib/api/laravel-client";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import type { StudyPlanDetail } from "@/types/guardian-study-planner";

export async function GET(
  _request: Request,
  context: { params: Promise<{ ref: string }> }
) {
  try {
    const { ref } = await context.params;
    const uuid = await requireChildUuid(ref);
    const plan = await laravelResourceNullable<StudyPlanDetail>(
      `/guardian/students/${uuid}/study-plans/current`,
      "study_plan"
    );
    return jsonSuccess(plan);
  } catch (error) {
    return jsonError(error);
  }
}
