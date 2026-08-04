import { fromRef } from "@/lib/api/sanitize";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import { requireAuth } from "@/lib/auth/session";
import { laravelRequest } from "@/lib/api/laravel-client";
import type { ChildProgress } from "@/types/domain/child";

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

    const progress = await laravelRequest<{
      student?: { name?: string };
      summary?: string | null;
      last_activity_at?: string | null;
    }>(`/guardian/students/${uuid}/progress`);

    const payload: ChildProgress = {
      ref,
      name: progress.student?.name ?? "Aluno",
      summary: progress.summary ?? null,
      lastActivityAt: progress.last_activity_at ?? null,
    };

    return jsonSuccess(payload);
  } catch (error) {
    return jsonError(error);
  }
}
