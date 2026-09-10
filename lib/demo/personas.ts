import { ApiError } from "@/types/api";
import type { AuthUser } from "@/types/auth";
import {
  DEMO_PERSONA_KEYS,
  type DemoPersona,
  type DemoPersonaKey,
  type DemoPersonaTokenResponse,
} from "@/types/demo";

export const DEMO_TOKEN_TTL_MS = 480 * 60 * 1000;

export const ADMIN_URL_MISSING_MESSAGE =
  "O endereço do painel da escola não está configurado.";

export const DEMO_PERSONA_LABELS: Record<DemoPersonaKey, string> = {
  teacher: "Helena · Professora",
  guardian: "Camila · Responsável",
  coordinator: "Ricardo · Coordenação",
};

const ADMIN_DEMO_PERSONA_KEYS = new Set<DemoPersonaKey>([
  "teacher",
  "coordinator",
]);

export function isDemoPersonaKey(value: string): value is DemoPersonaKey {
  return (DEMO_PERSONA_KEYS as readonly string[]).includes(value);
}

export function isAdminDemoPersona(key: DemoPersonaKey): boolean {
  return ADMIN_DEMO_PERSONA_KEYS.has(key);
}

export function shouldProbeDemoPersonas(
  user: { isDemo?: boolean } | null | undefined
): boolean {
  return Boolean(user) && user?.isDemo !== false;
}

export function personaLabel(persona: DemoPersona): string {
  const name = persona.name.trim();
  return name || DEMO_PERSONA_LABELS[persona.key];
}

export function resolveCurrentPersonaKey(
  personas: DemoPersona[],
  user: { demoPersonaKey?: string; email?: string } | null | undefined
): DemoPersonaKey | "" {
  const fromSession = user?.demoPersonaKey;
  if (fromSession && isDemoPersonaKey(fromSession)) {
    if (personas.some((persona) => persona.key === fromSession)) {
      return fromSession;
    }
  }

  const email = user?.email?.trim().toLowerCase();
  if (email) {
    const match = personas.find(
      (persona) => persona.email?.trim().toLowerCase() === email
    );
    if (match) return match.key;
  }

  return personas[0]?.key ?? "";
}

export function buildDemoHandoffUrl(baseUrl: string, token: string): string {
  const origin = baseUrl.replace(/\/$/, "");
  return `${origin}/#demo_token=${encodeURIComponent(token)}`;
}

function extractPersonaItems(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  const record = payload as Record<string, unknown>;
  if (Array.isArray(record.personas)) return record.personas;
  if (Array.isArray(record.data)) return record.data;

  if (record.data && typeof record.data === "object") {
    const nested = record.data as Record<string, unknown>;
    if (Array.isArray(nested.personas)) return nested.personas;
    if (Array.isArray(nested.data)) return nested.data;
  }

  return [];
}

export function normalizePersonasPayload(payload: unknown): DemoPersona[] {
  const seen = new Set<DemoPersonaKey>();
  const personas: DemoPersona[] = [];

  for (const item of extractPersonaItems(payload)) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const key = typeof record.key === "string" ? record.key : "";
    const name = typeof record.name === "string" ? record.name.trim() : "";
    if (!isDemoPersonaKey(key) || !name || seen.has(key)) continue;

    seen.add(key);
    const email = typeof record.email === "string" ? record.email.trim() : "";
    personas.push({
      key,
      name,
      ...(email ? { email } : {}),
    });
  }

  return personas;
}

export function parseDemoPersonaToken(
  payload: unknown
): DemoPersonaTokenResponse {
  if (!payload || typeof payload !== "object") {
    throw new ApiError({
      title: "Resposta inválida",
      status: 502,
      detail: "Não foi possível trocar de persona.",
    });
  }

  const record = payload as Record<string, unknown>;
  const nested =
    record.token && typeof record.token === "object"
      ? (record.token as Record<string, unknown>)
      : record;

  const token = typeof nested.token === "string" ? nested.token.trim() : "";
  const user = nested.user;
  if (!token || !user || typeof user !== "object") {
    throw new ApiError({
      title: "Resposta inválida",
      status: 502,
      detail: "Não foi possível trocar de persona.",
    });
  }

  return {
    token,
    token_type: "Bearer",
    expires_at:
      typeof nested.expires_at === "string" ? nested.expires_at : undefined,
    expires_in:
      typeof nested.expires_in === "number" ? nested.expires_in : undefined,
    refresh_token:
      typeof nested.refresh_token === "string" ? nested.refresh_token : undefined,
    user: user as AuthUser,
  };
}

export function demoTokenExpiresInSeconds(
  issued: Pick<DemoPersonaTokenResponse, "expires_in" | "expires_at">
): number {
  if (typeof issued.expires_in === "number" && issued.expires_in > 0) {
    return issued.expires_in;
  }

  if (issued.expires_at) {
    const remaining = Math.floor((Date.parse(issued.expires_at) - Date.now()) / 1000);
    if (remaining > 0) return remaining;
  }

  return Math.floor(DEMO_TOKEN_TTL_MS / 1000);
}
