import { jsonError, jsonSuccess } from "@/lib/api/response";
import { studentLaravelRequest } from "@/lib/api/student-laravel-client";
import type { ActivityResponseSummary } from "@/types/student-learning";

export async function POST(
  request: Request,
  context: { params: Promise<{ attemptUuid: string }> }
) {
  try {
    const { attemptUuid } = await context.params;
    const body = await request.json();

    const response = await studentLaravelRequest<ActivityResponseSummary>(
      `/mobile/student/attempts/${attemptUuid}/responses`,
      { method: "POST", data: body }
    );

    return jsonSuccess(response);
  } catch (error) {
    return jsonError(error);
  }
}
