import type { NextRequest } from "next/server";

import { laravelRequest } from "@/lib/api/laravel-client";
import { studentLaravelRequest } from "@/lib/api/student-laravel-client";
import {
  forbidden,
  jsonError,
  jsonSuccess,
  validationError,
} from "@/lib/api/response";
import { setStudentAuthCookies } from "@/lib/auth/student-cookies";
import { loginSchema } from "@/features/auth/schemas/auth.schema";
import type { LoginResponse } from "@/types/auth";

function isStudentUser(user: LoginResponse["user"]): boolean {
  return user.type === "student";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      const errors = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([key, value]) => [
          key,
          value?.[0] ?? "",
        ])
      );
      return validationError(errors);
    }

    const response = await laravelRequest<LoginResponse>("/mobile/auth/login", {
      method: "POST",
      data: {
        ...parsed.data,
        device_name: "student-web",
      },
      skipAuth: true,
      skipUnauthorizedRetry: true,
    });

    if (!isStudentUser(response.user)) {
      return forbidden(
        "Esta área é exclusiva para alunos. Responsáveis devem acessar pelo login principal."
      );
    }

    await setStudentAuthCookies({
      accessToken: response.token,
      refreshToken: response.refresh_token,
      expiresAt: response.expires_in
        ? Date.now() + response.expires_in * 1000
        : undefined,
    });

    const session = await studentLaravelRequest<Record<string, unknown>>(
      "/mobile/auth/session",
      { skipUnauthorizedRetry: true }
    );

    return jsonSuccess(session);
  } catch (error) {
    return jsonError(error);
  }
}
