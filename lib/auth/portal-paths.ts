/**
 * Paths canônicos dos portais do site — única fonte para navegação e redirects.
 */

export const GUARDIAN_HOME_PATH = "/";
export const STUDENT_HOME_PATH = "/aluno";
export const STUDENT_STUDIES_PATH = "/aluno/estudos";
export const STUDENT_PROGRESS_PATH = "/aluno/progresso";
export const STUDENT_LOGIN_PATH = "/aluno/entrar";
export const GUARDIAN_LOGIN_PATH = "/signin";

/** Alias legado mapeado para o dashboard do aluno. */
export const STUDENT_LEGACY_DASHBOARD_PATH = "/student/dashboard";

const SUPERVISION_PREFIX = "/aluno/supervisao/";

/**
 * Extrai o ref opaco do filho em `/aluno/supervisao/{childRef}/...`.
 */
export function parseSupervisionChildRef(pathname: string): string | null {
  if (!pathname.startsWith(SUPERVISION_PREFIX)) return null;
  const rest = pathname.slice(SUPERVISION_PREFIX.length);
  const childRef = rest.split("/")[0]?.trim();
  return childRef || null;
}

export function isSupervisionPath(pathname: string): boolean {
  return parseSupervisionChildRef(pathname) !== null;
}

export function supervisionHomePath(childRef: string): string {
  return `${SUPERVISION_PREFIX}${childRef}`;
}

export function supervisionMaterialsPath(childRef: string): string {
  return `${SUPERVISION_PREFIX}${childRef}/materiais`;
}

/**
 * `next` seguro no login do responsável: rotas do portal guardian ou supervisão.
 * Bloqueia `/aluno` e `/aluno/materiais` (exigem sessão de aluno).
 */
export function resolveGuardianPostLoginPath(
  next: string | null | undefined
): string {
  if (!next || typeof next !== "string") return GUARDIAN_HOME_PATH;

  const trimmed = next.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("://")) {
    return GUARDIAN_HOME_PATH;
  }

  if (trimmed.startsWith("/aluno/entrar")) {
    return GUARDIAN_HOME_PATH;
  }

  if (trimmed.startsWith("/aluno/supervisao/")) {
    return trimmed;
  }

  if (trimmed === "/aluno" || trimmed.startsWith("/aluno/")) {
    return GUARDIAN_HOME_PATH;
  }

  return trimmed;
}

export type StudentShellNavItem = {
  label: string;
  href: string;
  key: "home" | "environment" | "progress" | "studies" | "materials";
};

/**
 * Itens da sidebar do shell Kiddino do aluno / supervisão.
 */
export function resolveStudentShellNav(pathname: string): StudentShellNavItem[] {
  const childRef = parseSupervisionChildRef(pathname);

  if (childRef) {
    return [
      { key: "home", label: "Início", href: GUARDIAN_HOME_PATH },
      {
        key: "environment",
        label: "Ambiente do aluno",
        href: supervisionHomePath(childRef),
      },
      {
        key: "materials",
        label: "Materiais",
        href: supervisionMaterialsPath(childRef),
      },
    ];
  }

  return [
    { key: "home", label: "Início", href: STUDENT_HOME_PATH },
    {
      key: "progress",
      label: "Meu progresso",
      href: STUDENT_PROGRESS_PATH,
    },
    { key: "materials", label: "Materiais", href: `${STUDENT_HOME_PATH}/materiais` },
  ];
}

/**
 * Href ativo da sidebar do shell do aluno / supervisão.
 */
export function resolveStudentShellActiveHref(pathname: string): string | undefined {
  const childRef = parseSupervisionChildRef(pathname);

  if (childRef) {
    const base = supervisionHomePath(childRef);
    const materials = supervisionMaterialsPath(childRef);
    if (pathname === base || pathname === `${base}/`) return base;
    if (pathname.startsWith(`${materials}`)) return materials;
    return base;
  }

  if (pathname.startsWith(`${STUDENT_HOME_PATH}/materiais`)) {
    return `${STUDENT_HOME_PATH}/materiais`;
  }
  if (
    pathname === STUDENT_PROGRESS_PATH ||
    pathname.startsWith(`${STUDENT_PROGRESS_PATH}/`)
  ) {
    return STUDENT_PROGRESS_PATH;
  }
  if (
    pathname === STUDENT_HOME_PATH ||
    pathname === `${STUDENT_HOME_PATH}/` ||
    pathname === STUDENT_STUDIES_PATH ||
    pathname.startsWith(`${STUDENT_STUDIES_PATH}/`)
  ) {
    return STUDENT_HOME_PATH;
  }
  return undefined;
}
