import { bffClient } from "@/services/bff/client";
import type { SessionUser } from "@/types/session";

export const profileBff = {
  update(payload: { name: string }) {
    return bffClient<SessionUser>("/api/profile", {
      method: "PATCH",
      body: payload,
    });
  },
};
