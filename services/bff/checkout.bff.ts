import { bffClient } from "@/services/bff/client";

export const checkoutBff = {
  createSession(payload: Record<string, unknown>) {
    return bffClient<{ checkoutUrl: string }>("/api/checkout/session", {
      method: "POST",
      body: payload,
    });
  },
};
