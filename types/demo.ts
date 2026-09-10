import type { AuthUser } from "@/types/auth";
import type { LoginSuccessPayload } from "@/types/auth-login";

export const DEMO_PERSONA_KEYS = ["teacher", "guardian", "coordinator"] as const;

export type DemoPersonaKey = (typeof DEMO_PERSONA_KEYS)[number];

export interface DemoPersona {
  key: DemoPersonaKey;
  name: string;
  email?: string;
}

export interface DemoPersonaTokenResponse {
  token: string;
  token_type: "Bearer";
  expires_at?: string;
  expires_in?: number;
  refresh_token?: string;
  user: AuthUser;
}

export type DemoSwitchResult = LoginSuccessPayload;
export type DemoAdoptResult = LoginSuccessPayload;
