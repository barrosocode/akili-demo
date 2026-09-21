export interface DevLoginProfile {
  id: string;
  label: string;
  email: string;
  password: string;
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
  email: "aluno@escola-exemplo.dev",
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

export function isDevLoginPanelEnabled(): boolean {
  return process.env.NODE_ENV === "development";
}
