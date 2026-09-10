export type AccountOrigin = "b2c" | "school" | "unknown";

export type UserStatus = "active" | "invited" | "inactive" | "blocked";

export interface AuthUser {
  uuid: string;
  name: string;
  email: string;
  profile_photo_url: string | null;
  type: string;
  status: UserStatus;
  roles: string[];
  permissions: string[];
  account_origin?: AccountOrigin;
  last_login_at: string | null;
  is_demo?: boolean;
  demo_persona_key?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginResponse {
  token: string;
  token_type: "Bearer";
  refresh_token?: string;
  expires_in?: number;
  expires_at?: string;
  user: AuthUser;
}

export interface RefreshResponse {
  token: string;
  token_type: "Bearer";
  refresh_token?: string;
  expires_in?: number;
}

export interface AcceptInviteRequest {
  token: string;
  password: string;
  password_confirmation: string;
}
