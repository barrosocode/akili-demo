import type { ApiErrorPayload } from "@/services/bff/types";

export class BffClientError extends Error {
  readonly status: number;
  readonly title: string;
  readonly detail?: string;
  readonly type?: string;
  readonly errorCode?: string;
  readonly errors?: Record<string, string>;

  constructor(payload: ApiErrorPayload) {
    super(payload.detail ?? payload.title);
    this.name = "BffClientError";
    this.status = payload.status;
    this.title = payload.title;
    this.detail = payload.detail;
    this.type = payload.type;
    this.errorCode = payload.error_code;
    this.errors = payload.errors;
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
    throw new BffClientError(
      payload.error ?? {
        title: "Erro na requisição",
        status: response.status,
        detail: "Não foi possível concluir a operação.",
      }
    );
  }

  return (payload.data ?? payload) as T;
}
