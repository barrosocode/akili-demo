import { laravelRequest } from "@/lib/api/laravel-client";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { jsonError, jsonSuccess } from "@/lib/api/response";

export async function POST() {
  try {
    await laravelRequest("/client/auth/logout", { method: "POST" });
  } catch {
    // logout idempotente
  } finally {
    await clearAuthCookies();
  }

  return jsonSuccess({ ok: true });
}
