import { jsonError, jsonSuccess } from "@/lib/api/response";
import { studentLaravelRequest } from "@/lib/api/student-laravel-client";
import type { StudentProgressUpdate } from "@/types/student-learning";

export async function POST(
  request: Request,
  context: { params: Promise<{ contentUuid: string }> }
) {
  try {
    const { contentUuid } = await context.params;
    const body = await request.json();

    const progress = await studentLaravelRequest<StudentProgressUpdate>(
      `/mobile/student/contents/${contentUuid}/progress`,
      { method: "POST", data: body }
    );

    return jsonSuccess(progress);
  } catch (error) {
    return jsonError(error);
  }
}
