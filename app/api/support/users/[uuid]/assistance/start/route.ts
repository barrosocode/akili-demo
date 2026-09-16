import { laravelRequest, supportLaravelRequest } from "@/lib/api/laravel-client";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import { toApiError } from "@/lib/api/errors";
import { ApiError } from "@/types/api";
import { setAssistanceAuthCookie } from "@/lib/auth/assistance-cookies";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { clearStudentAuthCookies } from "@/lib/auth/student-cookies";
import { ASSISTANCE_ENTER_PATH } from "@/features/assistance/paths";
import type { SupportDeskStartResult } from "@/features/support-desk/types";

type RouteContext = { params: Promise<{ uuid: string }> };

type LaravelStartResponse = {
  session: { session_uuid: string };
  handoff: { code: string; expires_at: string };
};

type LaravelAdoptResponse = {
  token: string;
  token_type: string;
  expires_at: string;
  session_uuid: string;
};

const GENERIC_ERROR =
  "Não foi possível iniciar o atendimento. Tente novamente.";

/**
 * Start Assistance with support desk PAT, then adopt handoff into assistance cookie.
 * Adopt success = start success (portal loads /me on the next navigation).
 * Preserves support desk cookies so end can return to /suporte.
 */
export async function POST(_request: Request, context: RouteContext) {
  try {
    const { uuid } = await context.params;

    const started = await supportLaravelRequest<LaravelStartResponse>(
      `/support/users/${uuid}/assistance/start`,
      { method: "POST", data: {}, skipUnauthorizedRetry: true }
    );

    const code = started.handoff?.code?.trim();
    if (!code || code.length < 32) {
      throw new ApiError({
        title: "Atendimento indisponível",
        status: 400,
        detail: GENERIC_ERROR,
      });
    }

    let adopt: LaravelAdoptResponse;
    try {
      adopt = await laravelRequest<LaravelAdoptResponse>(
        "/support/assistance/adopt",
        {
          method: "POST",
          data: { code },
          skipAuth: true,
          skipUnauthorizedRetry: true,
        }
      );
    } catch (error) {
      const apiError = toApiError(error);
      throw new ApiError({
        title: "Atendimento indisponível",
        status: apiError.status === 429 ? 429 : 400,
        detail: GENERIC_ERROR,
      });
    }

    if (!adopt.token) {
      throw new ApiError({
        title: "Atendimento indisponível",
        status: 400,
        detail: GENERIC_ERROR,
      });
    }

    const expiresAt = adopt.expires_at
      ? Date.parse(adopt.expires_at)
      : Number.NaN;

    // Keep support desk cookies — only clear guardian/student personas.
    await clearStudentAuthCookies();
    await clearAuthCookies();
    await setAssistanceAuthCookie({
      accessToken: adopt.token,
      expiresAt: Number.isFinite(expiresAt) ? expiresAt : undefined,
    });

    const payload: SupportDeskStartResult = {
      redirectTo: ASSISTANCE_ENTER_PATH,
    };
    return jsonSuccess(payload);
  } catch (error) {
    return jsonError(error);
  }
}
