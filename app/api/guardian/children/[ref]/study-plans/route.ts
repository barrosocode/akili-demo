import { requireChildUuid } from "@/lib/api/guardian-child";
import {
  laravelResource,
  laravelResourceCollection,
} from "@/lib/api/laravel-client";
import { jsonError, jsonSuccess, validationError } from "@/lib/api/response";
import type {
  StudyPlanDetail,
  StudyPlanGenerateInput,
  StudyPlanSummary,
} from "@/types/guardian-study-planner";

function isGenerateInput(value: unknown): value is StudyPlanGenerateInput {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.starts_on === "string" &&
    typeof record.content_deadline_on === "string" &&
    Array.isArray(record.blocked_dates) &&
    Array.isArray(record.exams) &&
    Array.isArray(record.topics)
  );
}

export async function GET(
  request: Request,
  context: { params: Promise<{ ref: string }> }
) {
  try {
    const { ref } = await context.params;
    const uuid = await requireChildUuid(ref);
    const url = new URL(request.url);
    const page = url.searchParams.get("page") ?? "1";
    const pageSize = url.searchParams.get("page_size") ?? "15";

    const plans = await laravelResourceCollection<StudyPlanSummary>(
      `/guardian/students/${uuid}/study-plans?page=${page}&page_size=${pageSize}`,
      "study_plans"
    );
    return jsonSuccess(plans);
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ ref: string }> }
) {
  try {
    const { ref } = await context.params;
    const uuid = await requireChildUuid(ref);
    const body = await request.json().catch(() => null);

    if (!isGenerateInput(body)) {
      return validationError({
        topics: "Escolha os tópicos do roteiro.",
      });
    }

    const plan = await laravelResource<StudyPlanDetail>(
      `/guardian/students/${uuid}/study-plans`,
      "study_plan",
      { method: "POST", data: body }
    );
    return jsonSuccess(plan, 202);
  } catch (error) {
    return jsonError(error);
  }
}
