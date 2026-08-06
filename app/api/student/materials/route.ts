import { jsonError, jsonSuccess } from "@/lib/api/response";
import { studentLaravelRequest } from "@/lib/api/student-laravel-client";
import type { StudentMaterial } from "@/types/student-learning";

export async function GET() {
  try {
    const materials = await studentLaravelRequest<StudentMaterial[]>(
      "/mobile/student/materials"
    );
    return jsonSuccess(materials);
  } catch (error) {
    return jsonError(error);
  }
}
