import { jsonError, jsonSuccess } from "@/lib/api/response";
import { isConsentRequiredError, toApiError } from "@/lib/api/errors";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { fetchPortalSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const result = await fetchPortalSession();

    if (!result.ok) {
      if (result.error.status === 401) {
        await clearAuthCookies();
      }
      return jsonError(result.error);
    }

    return jsonSuccess(result.session);
  } catch (error) {
    const apiError = toApiError(error);
    if (apiError.status === 401) {
      await clearAuthCookies();
    }
    if (isConsentRequiredError(apiError)) {
      return jsonError(apiError);
    }
    return jsonError(apiError);
  }
}
