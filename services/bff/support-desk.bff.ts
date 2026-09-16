import { bffClient } from "@/services/bff/client";
import type {
  SupportDeskListResult,
  SupportDeskOperator,
  SupportDeskStartResult,
  SupportDeskUser,
} from "@/features/support-desk/types";

export const supportDeskBff = {
  login(email: string, password: string) {
    return bffClient<{
      portal: "support";
      redirectTo: string;
      session: SupportDeskOperator;
    }>("/api/support/auth/login", {
      method: "POST",
      body: { email, password },
    });
  },

  me() {
    return bffClient<SupportDeskOperator>("/api/support/auth/me");
  },

  logout() {
    return bffClient<{ ok: boolean }>("/api/support/auth/logout", {
      method: "POST",
    });
  },

  listUsers(params: {
    search?: string;
    status?: string;
    type?: string;
    page?: number;
    per_page?: number;
  }) {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.status) query.set("status", params.status);
    if (params.type) query.set("type", params.type);
    if (params.page) query.set("page", String(params.page));
    if (params.per_page) query.set("per_page", String(params.per_page));
    const qs = query.toString();
    return bffClient<SupportDeskListResult>(
      `/api/support/users${qs ? `?${qs}` : ""}`
    );
  },

  getUser(uuid: string) {
    return bffClient<SupportDeskUser>(`/api/support/users/${uuid}`);
  },

  startAssistance(uuid: string) {
    return bffClient<SupportDeskStartResult>(
      `/api/support/users/${uuid}/assistance/start`,
      { method: "POST", body: {} }
    );
  },
};
