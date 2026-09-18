import { laravelResource } from "@/lib/api/laravel-client";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import { fromRef } from "@/lib/api/sanitize";
import { requireAuth } from "@/lib/auth/session";
import type { LearningKpi } from "@/types/domain/learning";

const FORWARDED_PARAMS = [
  "date_from",
  "date_to",
  "outcome",
  "session_position",
] as const;

function forwardedQuery(url: string): string {
  const incoming = new URL(url).searchParams;
  const outgoing = new URLSearchParams();

  FORWARDED_PARAMS.forEach((key) => {
    const value = incoming.get(key);
    if (value) outgoing.set(key, value);
  });

  const query = outgoing.toString();
  return query ? `?${query}` : "";
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

    const kpi = await laravelResource<LearningKpi>(
      `/guardian/students/${uuid}/kpis/learning${forwardedQuery(request.url)}`,
      "learning_kpi"
    );

    return jsonSuccess(kpi);
  } catch (error) {
    return jsonError(error);
  }
}
