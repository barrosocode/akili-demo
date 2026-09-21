import { laravelRequest } from "@/lib/api/laravel-client";
import { studentLaravelRequest } from "@/lib/api/student-laravel-client";
import { hasStudentSessionCookie } from "@/lib/auth/student-cookies";
import { requireAuth } from "@/lib/auth/session";

/**
 * Consome FAQ/Tawk com sessão de aluno ou de responsável.
 */
export async function supportConsumeRequest<T>(path: string): Promise<T> {
  if (await hasStudentSessionCookie()) {
    return studentLaravelRequest<T>(path);
  }

  await requireAuth();
  return laravelRequest<T>(path);
}
