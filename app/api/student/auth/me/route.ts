import { jsonError, jsonSuccess } from "@/lib/api/response";
import { getStudentAccessToken } from "@/lib/auth/student-cookies";
import { studentLaravelRequest } from "@/lib/api/student-laravel-client";
import type { StudentPortalSession } from "@/types/student-learning";
import { ApiError } from "@/types/api";

export async function GET() {
  try {
    const token = await getStudentAccessToken();
    if (!token) {
      return jsonError(
        new ApiError({
          title: "Não autenticado",
          status: 401,
          detail: "Sessão de aluno ausente.",
        })
      );
    }

    const session = await studentLaravelRequest<StudentPortalSession>(
      "/mobile/auth/session",
      { skipUnauthorizedRetry: true }
    );

    return jsonSuccess(session);
  } catch (error) {
    return jsonError(error);
  }
}
