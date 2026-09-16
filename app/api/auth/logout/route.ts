import { laravelRequest } from "@/lib/api/laravel-client";
import {
  clearAssistanceAuthCookie,
  hasAssistanceSessionCookie,
} from "@/lib/auth/assistance-cookies";
import { clearAllPortalAuthCookies } from "@/lib/auth/cookies";
import { jsonSuccess } from "@/lib/api/response";

export async function POST() {
  try {
    if (await hasAssistanceSessionCookie()) {
      try {
        await laravelRequest("/support/assistance/end", {
          method: "POST",
          data: {},
          skipUnauthorizedRetry: true,
        });
      } catch {
        // best-effort
      }
      await clearAssistanceAuthCookie();
    }

    try {
      await laravelRequest("/client/auth/logout", { method: "POST" });
    } catch {
      // logout idempotente
    }
  } finally {
    await clearAllPortalAuthCookies();
  }

  return jsonSuccess({ ok: true });
}
