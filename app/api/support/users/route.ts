import type { NextRequest } from "next/server";

import { jsonError, jsonSuccess } from "@/lib/api/response";
import type { SupportDeskUserListItem } from "@/features/support-desk/types";

type LaravelListEnvelope = {
  data: SupportDeskUserListItem[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = new URLSearchParams();
    for (const key of ["search", "status", "type", "tenant_uuid", "page", "per_page"]) {
      const value = searchParams.get(key);
      if (value) query.set(key, value);
    }

    const qs = query.toString();
    // supportLaravelRequest unwraps `data` — use raw axios via path that returns items.
    // Laravel ApiResponse: { data: [...], meta }. unwrap gives array only.
    // Call with a wrapper that re-fetches meta via custom approach:
    const { laravelHttp } = await import("@/lib/api/laravel-client");
    const { getSupportAccessToken } = await import("@/lib/auth/support-cookies");
    const token = await getSupportAccessToken();
    if (!token) {
      return jsonError({
        title: "Não autenticado",
        status: 401,
        detail: "Sessão de atendimento expirada. Entre novamente.",
      });
    }

    const response = await laravelHttp.request<LaravelListEnvelope>({
      url: `/support/users${qs ? `?${qs}` : ""}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "x-skip-auth": "1",
        "x-skip-unauthorized-retry": "1",
      },
    });

    const payload = response.data;
    const items = Array.isArray(payload.data) ? payload.data : [];
    const meta = payload.meta ?? {
      current_page: 1,
      last_page: 1,
      per_page: items.length,
      total: items.length,
    };

    return jsonSuccess({ items, meta });
  } catch (error) {
    return jsonError(error);
  }
}
