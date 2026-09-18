import { fromRef } from "@/lib/api/sanitize";
import { requireAuth } from "@/lib/auth/session";
import { ApiError } from "@/types/api";

export async function requireChildUuid(ref: string): Promise<string> {
  await requireAuth();
  const uuid = fromRef(ref);

  if (!uuid) {
    throw new ApiError({
      title: "Não encontrado",
      status: 404,
      detail: "Filho não encontrado na sua conta.",
    });
  }

  return uuid;
}
