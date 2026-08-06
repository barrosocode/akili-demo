import type { NextRequest } from "next/server";

import {
  authenticateWithLaravel,
  establishGuardianSession,
  establishStudentSession,
} from "@/lib/auth/establish-session";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { clearStudentAuthCookies } from "@/lib/auth/student-cookies";
import {
  institutionalPortalMessage,
  resolvePortalDestination,
} from "@/lib/auth/portal-destination";
import {
  forbidden,
  jsonError,
  jsonSuccess,
  validationError,
} from "@/lib/api/response";
import { isGuardianUser } from "@/lib/permissions/guardian-capabilities";
import { loginSchema } from "@/features/auth/schemas/auth.schema";
import type { LoginSuccessPayload } from "@/types/auth-login";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      const errors = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([key, value]) => [
          key,
          value?.[0] ?? "",
        ])
      );
      return validationError(errors);
    }

    const response = await authenticateWithLaravel(
      parsed.data.email,
      parsed.data.password,
      "client-portal"
    );

    const destination = resolvePortalDestination(response.user);

    if (destination.portal === "student") {
      const session = await establishStudentSession(response);
      const payload: LoginSuccessPayload = {
        portal: "student",
        redirectTo: destination.redirectTo,
        session,
      };
      return jsonSuccess(payload);
    }

    if (destination.portal === "admin") {
      await clearAuthCookies();
      await clearStudentAuthCookies();
      const payload: LoginSuccessPayload = {
        portal: "admin",
        redirectTo: destination.redirectTo,
        session: {},
      };
      return jsonSuccess(payload);
    }

    if (!isGuardianUser(response.user)) {
      return forbidden(institutionalPortalMessage());
    }

    const session = await establishGuardianSession(response);
    const payload: LoginSuccessPayload = {
      portal: "guardian",
      redirectTo: destination.redirectTo,
      session,
    };
    return jsonSuccess(payload);
  } catch (error) {
    return jsonError(error);
  }
}
