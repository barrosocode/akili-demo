import { bffClient } from "@/services/bff/client";
import type { SessionUser } from "@/types/session";
import type { LoginSuccessPayload } from "@/types/auth-login";
import type { AcceptInviteRequest, LoginRequest, SignupRequest } from "@/types/auth";

export const authBff = {
  login(payload: LoginRequest) {
    return bffClient<LoginSuccessPayload>("/api/auth/login", {
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
    return bffClient<{ message: string }>("/api/auth/invite/accept", {
      method: "POST",
      body: payload,
    });
  },

  requestFirstAccessOtp(payload: { email: string }) {
    return bffClient<{ message: string }>("/api/auth/otp/request", {
      method: "POST",
      body: { ...payload, purpose: "first_access" },
    });
  },

  verifyFirstAccessOtp(payload: {
    email: string;
    code: string;
    password: string;
    password_confirmation: string;
  }) {
    return bffClient<{ message: string }>("/api/auth/otp/verify", {
      method: "POST",
      body: { ...payload, purpose: "first_access" },
    });
  },

  requestPasswordResetOtp(payload: { email: string }) {
    return bffClient<{ message: string }>("/api/auth/otp/request", {
      method: "POST",
      body: { ...payload, purpose: "password_reset" },
    });
  },

  verifyPasswordResetOtp(payload: {
    email: string;
    code: string;
    password: string;
    password_confirmation: string;
  }) {
    return bffClient<{ message: string }>("/api/auth/otp/verify", {
      method: "POST",
      body: { ...payload, purpose: "password_reset" },
    });
  },
};
