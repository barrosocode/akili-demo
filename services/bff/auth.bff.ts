import { bffClient } from "@/services/bff/client";
import type { SessionUser } from "@/types/session";
import type { AcceptInviteRequest, LoginRequest, SignupRequest } from "@/types/auth";

export const authBff = {
  login(payload: LoginRequest) {
    return bffClient<SessionUser>("/api/auth/login", {
      method: "POST",
      body: payload,
    });
  },

  signup(payload: SignupRequest) {
    return bffClient<SessionUser>("/api/auth/signup", {
      method: "POST",
      body: payload,
    });
  },

  logout() {
    return bffClient<{ ok: true }>("/api/auth/logout", { method: "POST" });
  },

  me() {
    return bffClient<SessionUser>("/api/auth/me");
  },

  acceptInvite(payload: AcceptInviteRequest) {
    return bffClient<SessionUser>("/api/auth/invite/accept", {
      method: "POST",
      body: payload,
    });
  },
};
