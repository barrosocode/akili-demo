import type { NextRequest } from "next/server";
import { laravelRequest } from "@/lib/api/laravel-client";
import {
  forbidden,
  jsonError,
  jsonSuccess,
  validationError,
} from "@/lib/api/response";
import { setAuthCookies } from "@/lib/auth/cookies";
import {
  isGuardianUser,
  toSessionUser,
} from "@/lib/permissions/guardian-capabilities";
import { loginSchema } from "@/features/auth/schemas/auth.schema";
import type { LoginResponse, AuthUser } from "@/types/auth";

async function persistAuth(response: LoginResponse) {
  await setAuthCookies({
    accessToken: response.token,
    refreshToken: response.refresh_token,
    expiresAt: response.expires_in
      ? Date.now() + response.expires_in * 1000
      : undefined,
  });
}

function ensureGuardian(user: AuthUser) {
  if (!isGuardianUser(user)) {
    return forbidden(
      "Este portal é exclusivo para responsáveis. Escolas devem acessar o painel administrativo."
    );
  }
  return null;
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

    const response = await laravelRequest<LoginResponse>("/client/auth/login", {
      method: "POST",
      data: {
        ...parsed.data,
        device_name: "client-portal",
      },
      skipAuth: true,
      skipUnauthorizedRetry: true,
    });

    const denied = ensureGuardian(response.user);
    if (denied) return denied;

    await persistAuth(response);
    return jsonSuccess(toSessionUser(response.user));
  } catch (error) {
    return jsonError(error);
  }
}
