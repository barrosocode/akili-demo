import { jsonError, jsonSuccess } from "@/lib/api/response";
import { studentLaravelResource } from "@/lib/api/student-laravel-client";
import type { LearningChart } from "@/types/domain/learning";

const FORWARDED_PARAMS = [
  "series",
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
    const chart = await studentLaravelResource<LearningChart>(
      `/mobile/student/charts/learning${forwardedQuery(request.url)}`,
      "learning_chart"
    );

    return jsonSuccess(chart);
  } catch (error) {
    return jsonError(error);
  }
}
