import { jsonError, jsonSuccess } from "@/lib/api/response";
import { studentLaravelRequest } from "@/lib/api/student-laravel-client";
import type { ActivityAttempt } from "@/types/student-learning";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ attemptUuid: string }> }
) {
  try {
    const { attemptUuid } = await context.params;
    const body = await request.json();

    const attempt = await studentLaravelRequest<ActivityAttempt>(
      `/mobile/student/attempts/${attemptUuid}`,
      { method: "PATCH", data: body }
    );

    return jsonSuccess(attempt);
  } catch (error) {
    return jsonError(error);
  }
}
