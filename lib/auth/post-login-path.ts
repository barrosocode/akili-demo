/**
 * Destino pós-login: path relativo interno seguro, ou dashboard `/`.
 * Rejeita URLs absolutas, protocol-relative (`//`) e vazios.
 */
export function resolvePostLoginPath(next: string | null | undefined): string {
  if (!next || typeof next !== "string") return "/";

  const trimmed = next.trim();
  if (!trimmed.startsWith("/")) return "/";
  if (trimmed.startsWith("//")) return "/";
  if (trimmed.includes("://")) return "/";

  return trimmed;
}
