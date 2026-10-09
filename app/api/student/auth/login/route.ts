import type { NextRequest } from "next/server";

import {
  authenticateStudentWithLaravel,
  establishStudentSession,
} from "@/lib/auth/establish-session";
import {
  resolvePortalDestination,
  STUDENT_DEFAULT_PATH,
} from "@/lib/auth/portal-destination";
import {
  forbidden,
  jsonError,
  jsonSuccess,
  validationError,
} from "@/lib/api/response";
import { studentLoginSchema } from "@/features/auth/schemas/auth.schema";
import type { LoginSuccessPayload } from "@/types/auth-login";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = studentLoginSchema.safeParse(body);

    if (!parsed.success) {
      const errors = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([key, value]) => [
          key,
          value?.[0] ?? "",
        ])
      );
      return validationError(errors);
    }

    const response = await authenticateStudentWithLaravel({
      login: parsed.data.login,
      password: parsed.data.password,
    });

    const destination = resolvePortalDestination(response.user);

    if (destination.portal === "student") {
      const session = await establishStudentSession(response);
      const payload: LoginSuccessPayload = {
        portal: "student",
        redirectTo: STUDENT_DEFAULT_PATH,
        session,
      };
      return jsonSuccess(payload);
    }

    if (destination.portal === "guardian") {
      return forbidden(
        "Esta área é exclusiva para alunos. Responsáveis devem acessar pelo login principal."
      );
    }

    const payload: LoginSuccessPayload = {
      portal: "admin",
      redirectTo: destination.redirectTo,
      session: {},
    };
    return jsonSuccess(payload);
  } catch (error) {
    return jsonError(error);
  }
}
