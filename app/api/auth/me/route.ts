import { jsonError, jsonSuccess } from "@/lib/api/response";
import { isConsentRequiredError, toApiError } from "@/lib/api/errors";
import { ApiError } from "@/types/api";
import {
  clearAssistanceAuthCookie,
  hasAssistanceSessionCookie,
} from "@/lib/auth/assistance-cookies";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { fetchPortalSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const result = await fetchPortalSession();

    if (!result.ok) {
      const hadAssistance = await hasAssistanceSessionCookie();

      if (result.error.status === 401) {
        await clearAuthCookies();
        await clearAssistanceAuthCookie();
      } else if (hadAssistance && result.error.status === 403) {
        await clearAssistanceAuthCookie();
        await clearAuthCookies();
        return jsonError(
          new ApiError({
            title: "Atendimento expirado",
            status: 403,
            detail: "A sessão de atendimento expirou.",
            type: "support-assistance-expired",
            error_code: "support_assistance_expired",
          })
        );
      }

      return jsonError(result.error);
    }

    return jsonSuccess(result.session);
  } catch (error) {
    const apiError = toApiError(error);
    if (apiError.status === 401) {
      await clearAuthCookies();
      await clearAssistanceAuthCookie();
    }
    if (isConsentRequiredError(apiError)) {
      return jsonError(apiError);
    }
    return jsonError(apiError);
  }
}
