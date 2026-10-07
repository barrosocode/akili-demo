import { ApiError, type ApiResponse } from "@/types/api";

export type EnvelopePagination = {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
};

export function unwrapData<T>(payload: unknown): T {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    (payload as ApiResponse<T>).data !== undefined
  ) {
    return (payload as ApiResponse<T>).data;
  }

  return payload as T;
}

function invalidResourceError(key: string): ApiError {
  return new ApiError({
    title: "Resposta inválida",
    status: 502,
    detail: `Não foi possível ler ${key} na resposta da API.`,
  });
}

export function unwrapResource<T>(payload: unknown, key: string): T {
  if (typeof payload === "object" && payload !== null && key in payload) {
    const value = (payload as Record<string, unknown>)[key];
    if (value !== undefined && value !== null) {
      return value as T;
    }
  }

  throw invalidResourceError(key);
}

/** Aceita `null` na chave (ex.: plano atual ainda não aplicado). */
export function unwrapResourceNullable<T>(payload: unknown, key: string): T | null {
  if (typeof payload === "object" && payload !== null && key in payload) {
    const value = (payload as Record<string, unknown>)[key];
    if (value === undefined) {
      throw invalidResourceError(key);
    }
    return value as T | null;
  }

  throw invalidResourceError(key);
}

export function unwrapPagination(payload: unknown): EnvelopePagination | null {
  if (typeof payload !== "object" || payload === null) return null;
  const pagination = (payload as Record<string, unknown>).pagination;
  if (typeof pagination !== "object" || pagination === null) return null;
  const record = pagination as Record<string, unknown>;
  if (
    typeof record.page !== "number" ||
    typeof record.page_size !== "number" ||
    typeof record.total_items !== "number" ||
    typeof record.total_pages !== "number"
  ) {
    return null;
  }

  return {
    page: record.page,
    page_size: record.page_size,
    total_items: record.total_items,
    total_pages: record.total_pages,
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

/** Lê uma coleção do envelope (`purchases`, `students`) ou de um array cru. */
export function extractEnvelopeList(
  payload: unknown,
  key: string
): { items: unknown[]; pagination: unknown } {
  if (Array.isArray(payload)) {
    return { items: payload, pagination: null };
  }

  const record = asRecord(payload);
  if (!record) return { items: [], pagination: null };

  if (Array.isArray(record[key])) {
    return { items: record[key], pagination: record.pagination ?? null };
  }

  const nested = asRecord(record.data);
  if (nested && Array.isArray(nested[key])) {
    return {
      items: nested[key],
      pagination: nested.pagination ?? record.pagination ?? null,
    };
  }

  if (Array.isArray(record.data)) {
    return { items: record.data, pagination: record.pagination ?? null };
  }

  return { items: [], pagination: record.pagination ?? null };
}
