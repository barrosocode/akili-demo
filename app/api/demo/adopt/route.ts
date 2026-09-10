import type { NextRequest } from "next/server";

import { jsonError, jsonSuccess, validationError } from "@/lib/api/response";
import { ApiError } from "@/types/api";
import { clearAuthCookies, setAuthCookies } from "@/lib/auth/cookies";
import { clearStudentAuthCookies } from "@/lib/auth/student-cookies";
import { resolveAdminHandoffUrl } from "@/lib/auth/config";
import { fetchPortalSession } from "@/lib/auth/session";
import { GUARDIAN_DEFAULT_PATH } from "@/lib/auth/portal-destination";
import { adoptDemoTokenSchema } from "@/features/demo/schemas/demo.schema";
import {
  ADMIN_URL_MISSING_MESSAGE,
  DEMO_TOKEN_TTL_MS,
  buildDemoHandoffUrl,
} from "@/lib/demo/personas";
import type { DemoAdoptResult } from "@/types/demo";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = adoptDemoTokenSchema.safeParse(body);

    if (!parsed.success) {
      return validationError({ token: "Token inválido" });
    }

    const { token } = parsed.data;

    await clearStudentAuthCookies();
    await setAuthCookies({
      accessToken: token,
      expiresAt: Date.now() + DEMO_TOKEN_TTL_MS,
    });

    const portal = await fetchPortalSession();
    if (portal.ok) {
      const payload: DemoAdoptResult = {
        portal: "guardian",
        redirectTo: GUARDIAN_DEFAULT_PATH,
        session: portal.session,
      };
      return jsonSuccess(payload);
    }

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

    const payload: DemoAdoptResult = {
      portal: "admin",
      redirectTo: buildDemoHandoffUrl(adminUrl, token),
      session: {},
    };
    return jsonSuccess(payload);
  } catch (error) {
    return jsonError(error);
  }
}
