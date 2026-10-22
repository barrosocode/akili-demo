import { unwrapResource } from "@/lib/api/envelope";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import { studentLaravelRequest } from "@/lib/api/student-laravel-client";
import type { StudentFrequency } from "@/types/student-learning";

function frequencyPath(requestUrl: string): string {
  const subjectUuid = new URL(requestUrl).searchParams.get("subject_uuid")?.trim() ?? "";
  if (!subjectUuid) return "/mobile/student/kpis/frequency";

  const query = new URLSearchParams();
  query.set("subject_uuid", subjectUuid);
  return `/mobile/student/kpis/frequency?${query.toString()}`;
}

export async function GET(request: Request) {
  try {
    const payload = await studentLaravelRequest<unknown>(frequencyPath(request.url));
    const frequency = unwrapResource<StudentFrequency>(payload, "frequency");
    return jsonSuccess(frequency);
  } catch (error) {
    return jsonError(error);
  }
}
