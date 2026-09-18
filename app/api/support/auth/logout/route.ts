import {
  clearSupportAuthCookies,
  getSupportAccessToken,
} from "@/lib/auth/support-cookies";
import { laravelRequest } from "@/lib/api/laravel-client";
import { jsonError, jsonSuccess } from "@/lib/api/response";

export async function POST() {
  try {
    const token = await getSupportAccessToken();
    if (token) {
      try {
        await laravelRequest("/support/auth/logout", {
          method: "POST",
          skipUnauthorizedRetry: true,
        });
      } catch {
        // logout idempotente
      }
    }
  } catch {
    // ignore
  } finally {
    await clearSupportAuthCookies();
  }

  return jsonSuccess({ ok: true });
}
