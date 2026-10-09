export interface DevLoginProfile {
  id: string;
  label: string;
  password: string;
  email?: string;
  login?: string;
}

export function devProfileIdentifier(profile: DevLoginProfile): string {
  return profile.login ?? profile.email ?? "";
}

export const DEV_LOGIN_GUARDIAN: DevLoginProfile = {
  id: "guardian",
  label: "Responsável",
  email: "responsavel@escola-exemplo.dev",
  password: "password",
};

export const DEV_LOGIN_STUDENT: DevLoginProfile = {
  id: "student",
  label: "Aluno",
  login: "aluno",
  password: "123123",
};

/** Painel do /signin (login unificado). */
export const DEV_LOGIN_PROFILES: readonly DevLoginProfile[] = [
  DEV_LOGIN_GUARDIAN,
  DEV_LOGIN_STUDENT,
];

/** Painel do /aluno/entrar. */
export const DEV_LOGIN_STUDENT_PROFILES: readonly DevLoginProfile[] = [
  DEV_LOGIN_STUDENT,
];

function isEnabledEnvFlag(value: string | undefined): boolean {
  const normalized = value?.trim().toLowerCase();
  return normalized === "true" || normalized === "1";
}

/**
 * Painel de acesso rápido no login.
 * - Local (`next dev`): sempre visível.
 * - Produção/demo: ligar com `DEV_LOGIN_PANEL=true` (runtime, server) e/ou
 *   `NEXT_PUBLIC_DEV_LOGIN_PANEL=true` (inlined no build).
 */
export function isDevLoginPanelEnabled(): boolean {
  if (process.env.NODE_ENV === "development") {
    return true;
  }
  return (
    isEnabledEnvFlag(process.env.DEV_LOGIN_PANEL) ||
    isEnabledEnvFlag(process.env.NEXT_PUBLIC_DEV_LOGIN_PANEL)
  );
}
