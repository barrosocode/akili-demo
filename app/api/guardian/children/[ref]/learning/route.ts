import { fromRef } from "@/lib/api/sanitize";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import { requireAuth } from "@/lib/auth/session";
import { laravelRequest } from "@/lib/api/laravel-client";
import type { StudentDashboard } from "@/types/student-learning";

function learningPath(uuid: string, requestUrl: string): string {
  const subjectUuid = new URL(requestUrl).searchParams.get("subject_uuid")?.trim() ?? "";
  const base = `/guardian/students/${uuid}/learning`;
  if (!subjectUuid) return base;

  const query = new URLSearchParams();
  query.set("subject_uuid", subjectUuid);
  return `${base}?${query.toString()}`;
}

export async function GET(
  request: Request,
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
      learningPath(uuid, request.url)
    );

    return jsonSuccess(learning);
  } catch (error) {
    return jsonError(error);
  }
}
