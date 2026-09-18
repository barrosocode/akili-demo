import type { NextRequest } from "next/server";

import {
  authenticateSupportWithLaravel,
  establishSupportSession,
} from "@/lib/auth/establish-session";
import {
  jsonError,
  jsonSuccess,
  validationError,
} from "@/lib/api/response";
import { SUPPORT_HOME_PATH } from "@/lib/auth/support-config";
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

    const response = await authenticateSupportWithLaravel(
      parsed.data.email,
      parsed.data.password
    );

    const session = await establishSupportSession(response);
    const payload: LoginSuccessPayload = {
      portal: "support",
      redirectTo: SUPPORT_HOME_PATH,
      session,
    };
    return jsonSuccess(payload);
  } catch (error) {
    return jsonError(error);
  }
}
