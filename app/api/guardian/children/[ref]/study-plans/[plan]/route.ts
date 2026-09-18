import { requireChildUuid } from "@/lib/api/guardian-child";
import { laravelResource } from "@/lib/api/laravel-client";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import { ApiError } from "@/types/api";
import type { StudyPlanDetail } from "@/types/guardian-study-planner";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(
  _request: Request,
  context: { params: Promise<{ ref: string; plan: string }> }
) {
  try {
    const { ref, plan } = await context.params;
    const uuid = await requireChildUuid(ref);

    if (!UUID_RE.test(plan)) {
      throw new ApiError({
        title: "Não encontrado",
        status: 404,
        detail: "Plano de estudos não encontrado.",
      });
    }

    const detail = await laravelResource<StudyPlanDetail>(
      `/guardian/students/${uuid}/study-plans/${plan}`,
      "study_plan"
    );
    return jsonSuccess(detail);
  } catch (error) {
    return jsonError(error);
  }
}
