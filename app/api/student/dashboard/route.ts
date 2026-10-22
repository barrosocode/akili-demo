import { jsonError, jsonSuccess } from "@/lib/api/response";
import { studentLaravelRequest } from "@/lib/api/student-laravel-client";
import type { StudentDashboard } from "@/types/student-learning";

function dashboardPath(requestUrl: string): string {
  const subjectUuid = new URL(requestUrl).searchParams.get("subject_uuid")?.trim() ?? "";
  if (!subjectUuid) return "/mobile/student/dashboard";

  const query = new URLSearchParams();
  query.set("subject_uuid", subjectUuid);
  return `/mobile/student/dashboard?${query.toString()}`;
}

export async function GET(request: Request) {
  try {
    const dashboard = await studentLaravelRequest<StudentDashboard>(
      dashboardPath(request.url)
    );
    return jsonSuccess(dashboard);
  } catch (error) {
    return jsonError(error);
  }
}
