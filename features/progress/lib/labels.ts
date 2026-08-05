import type { PerformanceLevel } from "@/types/domain/child";

const KNOWN_LEVELS = ["excellent", "evolving", "needs_support"] as const;

function isPerformanceLevel(value: string): value is PerformanceLevel {
  return (KNOWN_LEVELS as readonly string[]).includes(value);
}

export function performanceLabel(
  level: PerformanceLevel | string | null | undefined
): string {
  if (level == null || level === "") {
    return "Em acompanhamento";
  }

  if (!isPerformanceLevel(level)) {
    return "Em acompanhamento";
  }

  switch (level) {
    case "excellent":
      return "Excelente";
    case "evolving":
      return "Em evolução";
    case "needs_support":
      return "Precisa de apoio";
    default: {
      const _exhaustive: never = level;
      return _exhaustive;
    }
  }
}

export function formatMinutes(minutes: number | null | undefined): string {
  if (minutes == null) return "—";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest > 0 ? `${hours}h ${rest}min` : `${hours}h`;
}
