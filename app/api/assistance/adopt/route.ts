import type { NextRequest } from "next/server";

import { jsonError, jsonSuccess, validationError } from "@/lib/api/response";
import { toApiError } from "@/lib/api/errors";
import { ApiError } from "@/types/api";
import { laravelRequest } from "@/lib/api/laravel-client";
import { setAssistanceAuthCookie } from "@/lib/auth/assistance-cookies";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { clearStudentAuthCookies } from "@/lib/auth/student-cookies";
import { fetchPortalSession } from "@/lib/auth/session";
import { ASSISTANCE_ENTER_PATH } from "@/features/assistance/paths";
import { adoptAssistanceSchema } from "@/features/assistance/schemas/assistance.schema";
import type { AssistanceAdoptResult } from "@/features/assistance/types";

const GENERIC_HANDOFF_ERROR =
  "Não foi possível iniciar o atendimento. Solicite um novo acesso ao suporte.";

type LaravelAdoptResponse = {
  token: string;
  token_type: string;
  expires_at: string;
  session_uuid: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = adoptAssistanceSchema.safeParse(body);

    if (!parsed.success) {
      return validationError({ code: "Código inválido." });
    }

    // Nunca aceitar PAT / identidades vindas do browser.
    if (body && typeof body === "object") {
      const forbidden = [
        "token",
        "access_token",
        "operator_uuid",
        "target_uuid",
        "session_uuid",
        "tenant_id",
        "tenant_uuid",
      ];
      for (const key of forbidden) {
        if (key in body) {
          return validationError({ [key]: "Campo não permitido." });
        }
      }
    }

    let adopt: LaravelAdoptResponse;
    try {
      adopt = await laravelRequest<LaravelAdoptResponse>(
        "/support/assistance/adopt",
        {
          method: "POST",
          data: { code: parsed.data.code },
          skipAuth: true,
          skipUnauthorizedRetry: true,
        }
      );
    } catch (error) {
      const apiError = toApiError(error);
      throw new ApiError({
        title: "Atendimento indisponível",
        status: apiError.status === 429 ? 429 : 400,
        detail: GENERIC_HANDOFF_ERROR,
      });
    }

    if (!adopt.token || typeof adopt.token !== "string") {
      throw new ApiError({
        title: "Atendimento indisponível",
        status: 400,
        detail: GENERIC_HANDOFF_ERROR,
      });
    }

    const expiresAt = adopt.expires_at
      ? Date.parse(adopt.expires_at)
      : Number.NaN;

    await clearStudentAuthCookies();
    await clearAuthCookies();
    await setAssistanceAuthCookie({
      accessToken: adopt.token,
      expiresAt: Number.isFinite(expiresAt) ? expiresAt : undefined,
    });

    // Best-effort /me — adopt + cookie already prove success; never clear cookie on /me flake.
    const portal = await fetchPortalSession({ accessToken: adopt.token });

    const payload: AssistanceAdoptResult = {
      redirectTo: ASSISTANCE_ENTER_PATH,
      session: portal.ok ? portal.session : null,
    };

    // Nunca incluir token/PAT na response JSON.
    return jsonSuccess(payload);
  } catch (error) {
    return jsonError(error);
  }
}
