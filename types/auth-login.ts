import type { PortalKind } from "@/lib/auth/portal-destination";
import type { SessionUser } from "@/types/session";

export interface LoginSuccessPayload {
  portal: PortalKind;
  redirectTo: string;
  session: SessionUser | Record<string, unknown>;
}
