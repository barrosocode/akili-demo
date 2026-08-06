import { jsonError, jsonSuccess } from "@/lib/api/response";
import { clearStudentAuthCookies } from "@/lib/auth/student-cookies";
import { studentLaravelRequest } from "@/lib/api/student-laravel-client";

export async function POST() {
  try {
    await studentLaravelRequest("/mobile/auth/logout", { method: "POST" });
  } catch {
    // Limpa cookies mesmo se a API falhar.
  }

  await clearStudentAuthCookies();
  return jsonSuccess({ ok: true });
}
