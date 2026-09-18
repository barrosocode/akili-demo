import { unwrapResource } from "@/lib/api/envelope";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import { studentLaravelRequest } from "@/lib/api/student-laravel-client";
import type { StudentFrequency } from "@/types/student-learning";

export async function GET() {
  try {
    const payload = await studentLaravelRequest<unknown>(
      "/mobile/student/kpis/frequency"
    );
    const frequency = unwrapResource<StudentFrequency>(payload, "frequency");
    return jsonSuccess(frequency);
  } catch (error) {
    return jsonError(error);
  }
}
