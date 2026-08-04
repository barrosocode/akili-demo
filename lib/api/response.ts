import { NextResponse } from "next/server";
import { ApiError } from "@/types/api";
import { getFieldErrors, toApiError } from "@/lib/api/errors";

export function jsonSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function jsonError(error: unknown) {
  const apiError = toApiError(error);
  return NextResponse.json(
    {
      error: {
        title: apiError.title,
        status: apiError.status,
        detail: apiError.detail,
        errors: getFieldErrors(apiError.errors),
      },
    },
    { status: apiError.status }
  );
}

export function notImplemented(feature: string) {
  return NextResponse.json(
    {
      error: {
        title: "Em breve",
        status: 501,
        detail: `${feature} ainda não está disponível.`,
      },
    },
    { status: 501 }
  );
}

export function validationError(errors: Record<string, string>) {
  return NextResponse.json(
    {
      error: {
        title: "Dados inválidos",
        status: 422,
        detail: "Verifique os campos informados.",
        errors,
      },
    },
    { status: 422 }
  );
}

export function forbidden(detail?: string) {
  return NextResponse.json(
    {
      error: {
        title: "Acesso negado",
        status: 403,
        detail: detail ?? "Você não tem permissão para acessar este portal.",
      },
    },
    { status: 403 }
  );
}

export function isApiErrorResponse(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
