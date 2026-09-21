import { jsonError, jsonSuccess } from "@/lib/api/response";
import { studentLaravelResource } from "@/lib/api/student-laravel-client";
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

export async function GET(request: Request) {
  try {
    const kpi = await studentLaravelResource<LearningKpi>(
      `/mobile/student/kpis/learning${forwardedQuery(request.url)}`,
      "learning_kpi"
    );

    return jsonSuccess(kpi);
  } catch (error) {
    return jsonError(error);
  }
}
