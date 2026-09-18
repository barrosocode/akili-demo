import { jsonError, jsonSuccess } from "@/lib/api/response";
import { studentLaravelRequest } from "@/lib/api/student-laravel-client";
import type { LearningSession } from "@/types/student-learning";

export async function POST(
  request: Request,
  context: { params: Promise<{ contentUuid: string }> }
) {
  try {
    const { contentUuid } = await context.params;
    const body = await request.json();

    const session = await studentLaravelRequest<LearningSession>(
      `/mobile/student/contents/${contentUuid}/sessions`,
      { method: "POST", data: body }
    );

    return jsonSuccess(session);
  } catch (error) {
    return jsonError(error);
  }
}
