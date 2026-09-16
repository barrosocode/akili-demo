import { isAxiosError, type AxiosError } from "axios";
import { ApiError, type ProblemDetails } from "@/types/api";

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

function isProblemDetails(data: unknown): data is ProblemDetails {
  if (typeof data !== "object" || data === null) return false;
  const record = data as Record<string, unknown>;
  return typeof record.title === "string" && typeof record.status === "number";
}

export function parseAxiosProblem(error: AxiosError): ProblemDetails {
  const status = error.response?.status ?? 500;
  const data = error.response?.data;

  if (isProblemDetails(data)) {
    const record = data as ProblemDetails & Record<string, unknown>;
    return {
      ...data,
      status: data.status ?? status,
      error_code:
        typeof record.error_code === "string" ? record.error_code : undefined,
    };
  }

  return {
    title: error.response?.statusText || "Erro na requisição",
    status,
    detail: error.message || `HTTP ${status}`,
  };
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (isAxiosError(error)) {
    return new ApiError(parseAxiosProblem(error));
  }

  if (isProblemDetails(error)) {
    return new ApiError(error);
  }

  if (error instanceof Error) {
    return new ApiError({
      title: "Erro na requisição",
      status: 500,
      detail: error.message,
    });
  }

  return new ApiError({
    title: "Erro na requisição",
    status: 500,
    detail: "Erro desconhecido",
  });
}

export function isAssistanceExpiredError(error: unknown): boolean {
  const apiError = toApiError(error);
  if (apiError.errorCode === "support_assistance_expired") return true;
  const type = apiError.type?.toLowerCase() ?? "";
  return type.includes("support-assistance-expired");
}

export function isAssistanceReadOnlyError(error: unknown): boolean {
  const apiError = toApiError(error);
  if (apiError.errorCode === "support_assistance_read_only") return true;
  const type = apiError.type?.toLowerCase() ?? "";
  return type.includes("support-assistance-read-only");
}

export function isConsentRequiredError(error: unknown): boolean {
  const apiError = toApiError(error);
  if (apiError.status !== 403) return false;
  const type = apiError.type?.toLowerCase() ?? "";
  return type.includes("consent-required") || apiError.title === "Termos pendentes";
}

export function getFieldErrors(
  errors?: Record<string, string[]>
): Record<string, string> {
  if (!errors) return {};
  return Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => [field, messages[0] ?? ""])
  );
}

const STATUS_FALLBACKS: Record<number, string> = {
  400: "Não foi possível processar a solicitação.",
  401: "Sua sessão expirou. Faça login novamente.",
  403: "Você não tem permissão para esta ação.",
  404: "Registro não encontrado.",
  422: "Verifique os campos destacados e tente novamente.",
  429: "Muitas tentativas. Aguarde um momento.",
  500: "Ocorreu um erro inesperado. Tente novamente.",
  501: "Funcionalidade em breve.",
};

export function getUserFacingApiMessage(
  error: unknown,
  fallback = "Não foi possível concluir a operação."
): string {
  if (isApiError(error)) {
    const detail = error.detail?.trim();
    if (detail) return detail;
    return STATUS_FALLBACKS[error.status] ?? fallback;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "detail" in error &&
    typeof (error as { detail?: unknown }).detail === "string"
  ) {
    const detail = (error as { detail: string }).detail.trim();
    if (detail) return detail;
  }

  return fallback;
}
