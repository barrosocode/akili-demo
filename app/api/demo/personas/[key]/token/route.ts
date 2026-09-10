import { laravelRequest } from "@/lib/api/laravel-client";
import { jsonError, jsonSuccess, validationError } from "@/lib/api/response";
import { ApiError } from "@/types/api";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { clearStudentAuthCookies } from "@/lib/auth/student-cookies";
import { resolveAdminHandoffUrl } from "@/lib/auth/config";
import { establishGuardianSession } from "@/lib/auth/establish-session";
import {
  resolvePortalDestination,
} from "@/lib/auth/portal-destination";
import { requireAuth } from "@/lib/auth/session";
import { demoPersonaKeySchema } from "@/features/demo/schemas/demo.schema";
import {
  ADMIN_URL_MISSING_MESSAGE,
  buildDemoHandoffUrl,
  demoTokenExpiresInSeconds,
  isAdminDemoPersona,
  parseDemoPersonaToken,
} from "@/lib/demo/personas";
import type { DemoSwitchResult } from "@/types/demo";

export async function POST(
  _request: Request,
  context: { params: Promise<{ key: string }> }
) {
  try {
    await requireAuth();
    const { key } = await context.params;
    const parsedKey = demoPersonaKeySchema.safeParse(key);

    if (!parsedKey.success) {
      return validationError({ key: "Persona inválida." });
    }

    const personaKey = parsedKey.data;

    if (isAdminDemoPersona(personaKey) && !resolveAdminHandoffUrl()) {
      throw new ApiError({
        title: "Configuração incompleta",
        status: 400,
        detail: ADMIN_URL_MISSING_MESSAGE,
      });
    }

    const issued = parseDemoPersonaToken(
      await laravelRequest<unknown>(
        `/demo/personas/${encodeURIComponent(personaKey)}/token`,
        { method: "POST" }
      )
    );

    const destination = resolvePortalDestination(issued.user);

    if (destination.portal === "admin") {
      await clearAuthCookies();
      await clearStudentAuthCookies();

      const adminUrl = resolveAdminHandoffUrl();
      if (!adminUrl) {
        throw new ApiError({
          title: "Configuração incompleta",
          status: 400,
          detail: ADMIN_URL_MISSING_MESSAGE,
        });
      }

      const payload: DemoSwitchResult = {
        portal: "admin",
        redirectTo: buildDemoHandoffUrl(adminUrl, issued.token),
        session: {},
      };
      return jsonSuccess(payload);
    }

    if (destination.portal !== "guardian") {
      await clearAuthCookies();
      await clearStudentAuthCookies();
      throw new ApiError({
        title: "Acesso negado",
        status: 403,
        detail: "Esta persona não pode usar o portal da família.",
      });
    }

    const session = await establishGuardianSession({
      token: issued.token,
      token_type: issued.token_type,
      refresh_token: issued.refresh_token,
      expires_in: demoTokenExpiresInSeconds(issued),
      expires_at: issued.expires_at,
      user: issued.user,
    });

    const payload: DemoSwitchResult = {
      portal: "guardian",
      redirectTo: destination.redirectTo,
      session,
    };
    return jsonSuccess(payload);
  } catch (error) {
    return jsonError(error);
  }
}
