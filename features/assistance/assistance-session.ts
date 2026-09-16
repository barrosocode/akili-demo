import type {
  ClientPortalSession,
  PortalAssistance,
} from "../../types/portal-session";
import type { SessionAssistance, SessionUser } from "../../types/session";

export function mapPortalAssistance(
  assistance: PortalAssistance | null | undefined
): SessionAssistance | null {
  if (!assistance?.active) return null;

  return {
    active: true,
    sessionUuid: assistance.session_uuid,
    readOnly: Boolean(assistance.read_only),
    expiresAt: assistance.expires_at,
    operator: {
      uuid: assistance.operator.uuid,
      name: assistance.operator.name,
    },
    target: {
      uuid: assistance.target.uuid,
      name: assistance.target.name,
    },
  };
}

export function isAssistanceReadOnly(
  user: Pick<SessionUser, "assistance"> | null | undefined
): boolean {
  return Boolean(user?.assistance?.active && user.assistance.readOnly);
}

/** UX-only: force mutation capabilities off while assistance is active. */
export function applyAssistanceCapabilities(
  capabilities: SessionUser["capabilities"],
  assistance: SessionAssistance | null
): SessionUser["capabilities"] {
  if (!assistance?.readOnly) return capabilities;
  return {
    ...capabilities,
    canAddChildren: false,
    canPurchase: false,
  };
}

export function assertAdoptResponseHasNoSecrets(
  payload: Record<string, unknown>
): boolean {
  const forbidden = ["token", "access_token", "pat", "refresh_token", "code"];
  return forbidden.every((key) => !(key in payload));
}

export type { ClientPortalSession };
