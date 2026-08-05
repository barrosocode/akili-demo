import type { AccountOrigin, UserStatus } from "@/types/auth";

export interface PortalSessionUser {
  uuid: string;
  name: string;
  email: string;
  profile_photo_url: string | null;
  type: string;
  status: UserStatus;
  last_login_at: string | null;
}

export interface PortalGuardian {
  uuid: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
}

export interface PortalChild {
  uuid: string;
  name: string;
  profile_photo_url: string | null;
  avatar: string | null;
  status: string;
  grade_label: string | null;
  classroom_name: string | null;
  school_name: string | null;
  progress: unknown;
  can_view_progress: boolean;
  can_purchase: boolean;
  accessible: boolean;
}

export interface PortalPendingTerm {
  uuid: string;
  key: string;
  title: string;
  version: string;
  type: string;
}

export interface PortalTerms {
  pending: PortalPendingTerm[];
  all_accepted: boolean;
}

export interface ClientPortalSession {
  user: PortalSessionUser;
  guardian: PortalGuardian | null;
  subscription: null;
  roles: string[];
  permissions: string[];
  children: PortalChild[];
  terms: PortalTerms;
  preferences: Record<string, unknown>;
  account_origin?: AccountOrigin;
}
