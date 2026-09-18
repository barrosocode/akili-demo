import { jsonError, jsonSuccess } from "@/lib/api/response";
import { studentLaravelRequest } from "@/lib/api/student-laravel-client";
import type { LearningSession } from "@/types/student-learning";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ sessionUuid: string }> }
) {
  try {
    const { sessionUuid } = await context.params;
    const body = await request.json();

    const session = await studentLaravelRequest<LearningSession>(
      `/mobile/student/sessions/${sessionUuid}`,
      { method: "PATCH", data: body }
    );

    return jsonSuccess(session);
  } catch (error) {
    return jsonError(error);
  }
}
