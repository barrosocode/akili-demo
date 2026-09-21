/**
 * Labels legíveis para auditoria de navegação em assistência.
 * Fonte de verdade da rota continua sendo o pathname.
 */

const EXACT_LABELS: Record<string, string> = {
  "/": "Meus filhos",
  "/children": "Meus filhos",
  "/children/new": "Adicionar filho",
  "/profile": "Meus dados",
  "/purchases": "Compras",
  "/relatorios": "Relatórios",
  "/ajuda": "Central de Ajuda",
  "/aluno/ajuda": "Central de Ajuda",
  "/terms": "Termos",
  "/aluno": "Ambiente do aluno",
  "/aluno/materiais": "Materiais",
  "/aluno/cadernos": "Cadernos",
  "/aluno/recentes": "Recentes",
  "/aluno/disciplinas": "Disciplinas",
};

/**
 * Remove query/fragment and normalizes pathname for audit.
 */
export function normalizeAssistancePath(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let path = trimmed.split("?")[0]?.split("#")[0] ?? "";
  if (!path) return null;

  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(path)) return null;

  if (!path.startsWith("/")) path = `/${path}`;
  path = `/${path.replace(/\/+/g, "/").replace(/^\/+/, "")}`;
  if (path !== "/" && path.endsWith("/")) path = path.slice(0, -1);

  if (path.length > 500) return null;
  return path;
}

export function isAssistanceHandoffPath(path: string): boolean {
  return (
    path === "/assistance/adopt" ||
    path.startsWith("/assistance/adopt/") ||
    path === "/assistance/entrar" ||
    path.startsWith("/assistance/entrar/")
  );
}

export function resolveAssistancePageLabel(pathname: string): string {
  const path = normalizeAssistancePath(pathname);
  if (!path) return "Portal";

  if (EXACT_LABELS[path]) return EXACT_LABELS[path];

  if (/^\/children\/[^/]+$/.test(path)) return "Filho";
  if (/^\/ajuda\/topicos(\/|$)/.test(path)) return "Central de Ajuda";
  if (/^\/aluno\/ajuda(\/|$)/.test(path)) return "Central de Ajuda";
  if (/^\/aluno\/supervisao\/[^/]+\/materiais(\/|$)/.test(path)) {
    return "Materiais";
  }
  if (/^\/aluno\/supervisao\/[^/]+(\/|$)/.test(path)) {
    return "Ambiente do aluno";
  }
  if (/^\/aluno\/materiais(\/|$)/.test(path)) return "Materiais";

  return "Portal";
}

export type AssistanceNavigatePayload = {
  path: string;
  page_label: string;
};

/**
 * Builds the browser→BFF payload. Never includes operator/target/session/tenant.
 */
export function buildAssistanceNavigatePayload(
  pathname: string
): AssistanceNavigatePayload | null {
  const path = normalizeAssistancePath(pathname);
  if (!path) return null;
  if (isAssistanceHandoffPath(path)) return null;

  return {
    path,
    page_label: resolveAssistancePageLabel(path),
  };
}

export function shouldReportAssistanceNavigation(options: {
  assistanceActive: boolean;
  pathname: string;
  lastReportedPath: string | null;
}): { report: false } | { report: true; payload: AssistanceNavigatePayload } {
  if (!options.assistanceActive) return { report: false };

  const payload = buildAssistanceNavigatePayload(options.pathname);
  if (!payload) return { report: false };

  if (options.lastReportedPath === payload.path) return { report: false };

  return { report: true, payload };
}

export function assertNavigatePayloadHasOnlyPathAndLabel(
  payload: Record<string, unknown>
): boolean {
  const keys = Object.keys(payload).sort();
  if (keys.length === 1 && keys[0] === "path") return true;
  return keys.length === 2 && keys[0] === "page_label" && keys[1] === "path";
}
