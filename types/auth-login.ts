import type { PortalKind } from "@/lib/auth/portal-destination";
import type { AuthUser } from "@/types/auth";
import type { SessionUser } from "@/types/session";

export interface LoginSuccessPayload {
  portal: PortalKind;
  redirectTo: string;
  session: SessionUser | AuthUser | Record<string, unknown>;
}
