import { jsonError, jsonSuccess } from "@/lib/api/response";
import { laravelRequest } from "@/lib/api/laravel-client";
import {
  clearAssistanceAuthCookie,
  hasAssistanceSessionCookie,
} from "@/lib/auth/assistance-cookies";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { resolveAssistanceAdminReturnUrl } from "@/lib/auth/config";
import type { AssistanceEndResult } from "@/features/assistance/types";

export async function POST() {
  const redirectTo = resolveAssistanceAdminReturnUrl();

  try {
    if (await hasAssistanceSessionCookie()) {
      try {
        await laravelRequest("/support/assistance/end", {
          method: "POST",
          data: {},
          skipUnauthorizedRetry: true,
        });
      } catch {
        // End best-effort — cookies locais são limpos no finally.
      }
    }
  } finally {
    await clearAssistanceAuthCookie();
    await clearAuthCookies();
  }

  return jsonSuccess<AssistanceEndResult>({ ok: true, redirectTo });
}

export function GET() {
  return jsonError({
    title: "Método não permitido",
    status: 405,
    detail: "Use POST para encerrar o atendimento.",
  });
}