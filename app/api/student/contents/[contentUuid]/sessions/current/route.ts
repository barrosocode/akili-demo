import { learningSessionCurrentSearchParams } from "@/lib/api/learning-session-query";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import { studentLaravelRequest } from "@/lib/api/student-laravel-client";
import type { LearningSession } from "@/types/student-learning";

export async function GET(
  request: Request,
  context: { params: Promise<{ contentUuid: string }> }
) {
  try {
    const { contentUuid } = await context.params;
    const query = learningSessionCurrentSearchParams(request.url);
    const suffix = query ? `?${query}` : "";

    const session = await studentLaravelRequest<LearningSession | null>(
      `/mobile/student/contents/${contentUuid}/sessions/current${suffix}`
    );

    return jsonSuccess(session);
  } catch (error) {
    return jsonError(error);
  }
}
