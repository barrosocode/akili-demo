import type { ApiErrorPayload } from "@/services/bff/types";

export class BffClientError extends Error {
  readonly status: number;
  readonly title: string;
  readonly detail?: string;
  readonly type?: string;
  readonly errorCode?: string | null;
  readonly errors?: Record<string, string>;
  readonly data?: unknown;

  constructor(payload: ApiErrorPayload) {
    super(payload.detail ?? payload.title);
    this.name = "BffClientError";
    this.status = payload.status;
    this.title = payload.title;
    this.detail = payload.detail;
    this.type = payload.type;
    this.errors = payload.errors;
    this.errorCode = payload.errorCode ?? payload.error_code ?? null;
    this.data = payload.data;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export async function bffClient<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, headers, ...rest } = options;

  const response = await fetch(path, {
    ...rest,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: "same-origin",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorPayload =
      payload && typeof payload === "object" && "error" in payload
        ? (payload.error as ApiErrorPayload)
        : {
            title: "Erro na requisição",
            status: response.status,
            detail: "Não foi possível concluir a operação.",
          };

    throw new BffClientError({
      ...errorPayload,
      status: errorPayload.status ?? response.status,
      data:
        payload && typeof payload === "object" && "data" in payload
          ? (payload as { data?: unknown }).data
          : undefined,
    });
  }

  if (typeof payload === "object" && payload !== null && "data" in payload) {
    return (payload as { data: T }).data;
  }

  return payload as T;
}
