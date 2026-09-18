const FORTALEZA_TZ = "America/Fortaleza";

/**
 * Formata YYYY-MM-DD no calendário de Fortaleza, sem deslocar pelo UTC da meia-noite.
 */
export function formatStudyCalendarDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return value;

  const date = new Date(`${match[1]}-${match[2]}-${match[3]}T12:00:00-03:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: FORTALEZA_TZ,
  }).format(date);
}

export function formatStudyWarningsCount(count: number): string {
  if (count <= 0) return "Nenhum aviso no plano";
  if (count === 1) return "1 aviso no plano";
  return `${count} avisos no plano`;
}

export function formatStudyDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: FORTALEZA_TZ,
  }).format(date);
}
