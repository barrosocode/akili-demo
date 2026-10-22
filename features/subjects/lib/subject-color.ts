const FALLBACK_SUBJECT_COLOR = "#64748b";
const HEX_COLOR = /^#([0-9a-fA-F]{6})$/;

export function resolveSubjectColor(color: string | null | undefined): string {
  if (!color) return FALLBACK_SUBJECT_COLOR;
  const match = color.trim().match(HEX_COLOR);
  if (!match?.[1]) return FALLBACK_SUBJECT_COLOR;
  return `#${match[1].toLowerCase()}`;
}

export function subjectSurfaceColor(color: string | null | undefined): string {
  const hex = resolveSubjectColor(color);
  const red = Number.parseInt(hex.slice(1, 3), 16);
  const green = Number.parseInt(hex.slice(3, 5), 16);
  const blue = Number.parseInt(hex.slice(5, 7), 16);
  return `rgba(${red}, ${green}, ${blue}, 0.12)`;
}
