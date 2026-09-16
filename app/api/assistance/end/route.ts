import { jsonError, jsonSuccess } from "@/lib/api/response";
import { laravelRequest } from "@/lib/api/laravel-client";
import {
  clearAssistanceAuthCookie,
  hasAssistanceSessionCookie,
} from "@/lib/auth/assistance-cookies";
import { clearAuthCookies } from "@/lib/auth/cookies";
import {
  ASSISTANCE_SUPPORT_DESK_RETURN_PATH,
  resolveAssistanceAdminReturnUrl,
} from "@/lib/auth/config";
import { hasSupportSessionCookie } from "@/lib/auth/support-cookies";
import type { AssistanceEndResult } from "@/features/assistance/types";

export async function POST() {
  const returnToDesk = await hasSupportSessionCookie();
  const redirectTo = returnToDesk
    ? ASSISTANCE_SUPPORT_DESK_RETURN_PATH
    : resolveAssistanceAdminReturnUrl();

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
