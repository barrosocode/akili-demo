import { fromRef } from "@/lib/api/sanitize";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import { requireAuth } from "@/lib/auth/session";
import { laravelRequest } from "@/lib/api/laravel-client";
import type { StudentDashboard } from "@/types/student-learning";

export async function GET(
  _request: Request,
  context: { params: Promise<{ ref: string }> }
) {
  try {
    await requireAuth();
    const { ref } = await context.params;
    const uuid = fromRef(ref);

    if (!uuid) {
      return jsonError({ title: "Não encontrado", status: 404 });
    }

    const learning = await laravelRequest<StudentDashboard>(
      `/guardian/students/${uuid}/learning`
    );

    return jsonSuccess(learning);
  } catch (error) {
    return jsonError(error);
  }
}
