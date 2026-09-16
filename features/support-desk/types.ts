import type { AuthUser } from "@/types/auth";

export interface SupportDeskTenant {
  uuid: string;
  name: string;
  slug: string;
}

export interface SupportDeskUserListItem {
  uuid: string;
  name: string;
  email: string;
  type: string;
  status: string;
  email_verified_at: string | null;
  last_login_at: string | null;
  created_at: string | null;
  tenant: SupportDeskTenant | null;
}

export interface SupportDeskUser extends SupportDeskUserListItem {
  updated_at: string | null;
  roles: Array<{
    slug: string | null;
    name: string | null;
    scope: string | null;
    status: string;
    school: { uuid: string; name: string } | null;
  }>;
  schools: Array<{
    uuid: string | null;
    name: string | null;
    status: string;
  }>;
}

export interface SupportDeskListResult {
  items: SupportDeskUserListItem[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface SupportDeskStartResult {
  redirectTo: string;
}

export type SupportDeskOperator = AuthUser;
