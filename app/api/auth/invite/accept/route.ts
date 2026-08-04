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
import { acceptInviteSchema } from "@/features/auth/schemas/auth.schema";
import type { LoginResponse, AuthUser } from "@/types/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = acceptInviteSchema.safeParse(body);

    if (!parsed.success) {
      const errors = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([key, value]) => [
          key,
          value?.[0] ?? "",
        ])
      );
      return validationError(errors);
    }

    const response = await laravelRequest<LoginResponse & { user: AuthUser }>(
      "/guardian/invite/accept",
      {
        method: "POST",
        data: parsed.data,
        skipAuth: true,
        skipUnauthorizedRetry: true,
      }
    );

    if (!isGuardianUser(response.user)) {
      return forbidden();
    }

    await setAuthCookies({
      accessToken: response.token,
      refreshToken: response.refresh_token,
      expiresAt: response.expires_in
        ? Date.now() + response.expires_in * 1000
        : undefined,
    });

    return jsonSuccess(toSessionUser(response.user));
  } catch (error) {
    return jsonError(error);
  }
}
