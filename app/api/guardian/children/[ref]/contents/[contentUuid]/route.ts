import { fromRef } from "@/lib/api/sanitize";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import { requireAuth } from "@/lib/auth/session";
import { laravelRequest } from "@/lib/api/laravel-client";
import type { ContentPlayback } from "@/types/student-learning";

export async function GET(
  _request: Request,
  context: { params: Promise<{ ref: string; contentUuid: string }> }
) {
  try {
    await requireAuth();
    const { ref, contentUuid } = await context.params;
    const uuid = fromRef(ref);

    if (!uuid) {
      return jsonError({ title: "Não encontrado", status: 404 });
    }

    const playback = await laravelRequest<ContentPlayback>(
      `/guardian/students/${uuid}/contents/${contentUuid}`
    );

    return jsonSuccess(playback);
  } catch (error) {
    return jsonError(error);
  }
}
