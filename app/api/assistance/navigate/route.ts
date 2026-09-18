import { jsonError, jsonSuccess, validationError } from "@/lib/api/response";
import { laravelRequest } from "@/lib/api/laravel-client";
import {
  clearAssistanceAuthCookie,
  hasAssistanceSessionCookie,
} from "@/lib/auth/assistance-cookies";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { isAssistanceExpiredError, toApiError } from "@/lib/api/errors";
import { navigateAssistanceSchema } from "@/features/assistance/schemas/assistance.schema";
import type { AssistanceNavigateResult } from "@/features/assistance/types";
import type { NextRequest } from "next/server";

type LaravelNavigateResponse = {
  recorded: boolean;
  deduplicated?: boolean;
};

export async function POST(request: NextRequest) {
  try {
    if (!(await hasAssistanceSessionCookie())) {
      return jsonError({
        title: "Atendimento inativo",
        status: 403,
        detail: "Não há sessão de atendimento ativa.",
      });
    }

    const body = await request.json().catch(() => null);
    const parsed = navigateAssistanceSchema.safeParse(body);

    if (!parsed.success) {
      return validationError({ path: "Informe o caminho da página." });
    }

    if (body && typeof body === "object") {
      const forbidden = [
        "token",
        "access_token",
        "operator_uuid",
        "target_uuid",
        "session_uuid",
        "assistance_session_uuid",
        "tenant_id",
        "tenant_uuid",
        "timestamp",
        "created_at",
      ];
      for (const key of forbidden) {
        if (key in body) {
          return validationError({ [key]: "Campo não permitido." });
        }
      }
    }

    const result = await laravelRequest<LaravelNavigateResponse>(
      "/support/assistance/navigate",
      {
        method: "POST",
        data: {
          path: parsed.data.path,
          page_label: parsed.data.page_label ?? undefined,
        },
        skipUnauthorizedRetry: true,
      }
    );

    return jsonSuccess<AssistanceNavigateResult>({
      recorded: Boolean(result.recorded),
      deduplicated: Boolean(result.deduplicated),
    });
  } catch (error) {
    if (isAssistanceExpiredError(error)) {
      await clearAssistanceAuthCookie();
      await clearAuthCookies();

      return jsonError({
        type: "support-assistance-expired",
        title: "Atendimento expirado",
        status: 403,
        detail: "A sessão de atendimento expirou.",
        error_code: "support_assistance_expired",
      });
    }

    return jsonError(toApiError(error));
  }
}

export function GET() {
  return jsonError({
    title: "Método não permitido",
    status: 405,
    detail: "Use POST para registrar navegação do atendimento.",
  });
}
