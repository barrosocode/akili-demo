import { supportLaravelRequest } from "@/lib/api/laravel-client";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import { clearSupportAuthCookies } from "@/lib/auth/support-cookies";
import type { AuthUser } from "@/types/auth";

export async function GET() {
  try {
    const user = await supportLaravelRequest<AuthUser>("/support/auth/me", {
      skipUnauthorizedRetry: true,
    });
    return jsonSuccess(user);
  } catch (error) {
    await clearSupportAuthCookies();
    return jsonError(error);
  }
}
