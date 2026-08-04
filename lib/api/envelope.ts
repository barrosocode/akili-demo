import type { ApiResponse } from "@/types/api";

export function unwrapData<T>(payload: ApiResponse<T> | T): T {
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
