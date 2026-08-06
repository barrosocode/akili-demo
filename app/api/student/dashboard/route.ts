import { jsonError, jsonSuccess } from "@/lib/api/response";
import { studentLaravelRequest } from "@/lib/api/student-laravel-client";
import type { StudentDashboard } from "@/types/student-learning";

export async function GET() {
  try {
    const dashboard = await studentLaravelRequest<StudentDashboard>(
      "/mobile/student/dashboard"
    );
    return jsonSuccess(dashboard);
  } catch (error) {
    return jsonError(error);
  }
}
