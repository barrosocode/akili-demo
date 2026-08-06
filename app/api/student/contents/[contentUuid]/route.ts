import { jsonError, jsonSuccess } from "@/lib/api/response";
import { studentLaravelRequest } from "@/lib/api/student-laravel-client";
import type { ContentPlayback } from "@/types/student-learning";

export async function GET(
  _request: Request,
  context: { params: Promise<{ contentUuid: string }> }
) {
  try {
    const { contentUuid } = await context.params;
    const playback = await studentLaravelRequest<ContentPlayback>(
      `/mobile/contents/${contentUuid}`
    );
    return jsonSuccess(playback);
  } catch (error) {
    return jsonError(error);
  }
}
