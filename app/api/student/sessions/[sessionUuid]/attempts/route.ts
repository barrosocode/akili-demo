import { jsonError, jsonSuccess } from "@/lib/api/response";
import { studentLaravelRequest } from "@/lib/api/student-laravel-client";
import type { ActivityAttempt } from "@/types/student-learning";

export async function POST(
  request: Request,
  context: { params: Promise<{ sessionUuid: string }> }
) {
  try {
    const { sessionUuid } = await context.params;
    const body = await request.json();

    const attempt = await studentLaravelRequest<ActivityAttempt>(
      `/mobile/student/sessions/${sessionUuid}/attempts`,
      { method: "POST", data: body }
    );

    return jsonSuccess(attempt);
  } catch (error) {
    return jsonError(error);
  }
}
