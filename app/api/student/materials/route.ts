import { jsonError, jsonSuccess } from "@/lib/api/response";
import { studentLaravelRequest } from "@/lib/api/student-laravel-client";
import type { StudentMaterial } from "@/types/student-learning";

function materialsPath(requestUrl: string): string {
  const params = new URL(requestUrl).searchParams;
  const search = params.get("search")?.trim() ?? "";
  const subjectUuid = params.get("subject_uuid")?.trim() ?? "";
  const query = new URLSearchParams();

  if (search) query.set("search", search);
  if (subjectUuid) query.set("subject_uuid", subjectUuid);

  const serialized = query.toString().replace(/\+/g, "%20");
  if (!serialized) return "/mobile/student/materials";

  return `/mobile/student/materials?${serialized}`;
}

export async function GET(request: Request) {
  try {
    const materials = await studentLaravelRequest<StudentMaterial[]>(
      materialsPath(request.url)
    );
    return jsonSuccess(materials);
  } catch (error) {
    return jsonError(error);
  }
}
