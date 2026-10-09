import type { NextRequest } from "next/server";

import {
  authenticateStudentWithLaravel,
  authenticateSupportWithLaravel,
  authenticateWithLaravel,
  establishGuardianSession,
  establishStudentSession,
  establishSupportSession,
  toAuthCredential,
} from "@/lib/auth/establish-session";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { clearStudentAuthCookies } from "@/lib/auth/student-cookies";
import { resolvePortalDestination } from "@/lib/auth/portal-destination";
import {
  jsonError,
  jsonSuccess,
  validationError,
} from "@/lib/api/response";
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

    const credential = toAuthCredential(parsed.data.email, parsed.data.password);
    const response = await authenticateWithLaravel(credential, "client-portal");

    const destination = resolvePortalDestination(response.user);

    if (destination.portal === "student") {
      const studentResponse = await authenticateStudentWithLaravel(credential);
      const session = await establishStudentSession(studentResponse);
      const payload: LoginSuccessPayload = {
        portal: "student",
        redirectTo: destination.redirectTo,
        session,
      };
      return jsonSuccess(payload);
    }

    if (destination.portal === "support") {
      if (!("email" in credential)) {
        return validationError({
          email: "Informe o e-mail de acesso.",
        });
      }
      // Emite PAT client-support e cookies da mesa (em vez de bounce para Admin).
      const supportResponse = await authenticateSupportWithLaravel(
        credential.email,
        credential.password
      );
      const session = await establishSupportSession(supportResponse);
      const payload: LoginSuccessPayload = {
        portal: "support",
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
