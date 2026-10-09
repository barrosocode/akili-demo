import type { StudyPlanStatus } from "@/types/student-study-board";
import type {
  OmittedTopicReason,
  ReviewModel,
} from "@/types/guardian-study-planner";

export const REVIEW_MODEL_LABELS = {
  dehaene: "Revisões espaçadas (Dehaene)",
  custom: "Personalizado",
  livre: "Livre",
} as const;

export function reviewModelForForm(value: string): ReviewModel {
  if (value === "custom" || value === "livre") return value;
  return "dehaene";
}

export const DIFFICULTY_LABELS = {
  N1: "N1 — mais leve",
  N2: "N2 — fácil",
  N3: "N3 — médio",
  N4: "N4 — desafiador",
  N5: "N5 — avançado",
} as const;

export const PLAN_STATUS_LABELS: Record<StudyPlanStatus, string> = {
  pending: "Na fila",
  generating: "Montando o roteiro",
  applied: "Ativo",
  failed: "Não foi possível gerar",
  superseded: "Substituído",
};

export const OMITTED_REASON_LABELS: Record<OmittedTopicReason, string> = {
  NO_PUBLISHED_CONTENT: "Ainda não há aula publicada neste tópico",
  NO_ENTITLEMENT: "Este conteúdo ainda não está liberado para o aluno",
  TOPIC_NOT_FOUND: "Tópico não encontrado no catálogo",
};

export function fortalezaTodayYmd(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Fortaleza",
  }).format(new Date());
}

export function addCalendarDays(ymd: string, days: number): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!match) return ymd;
  const date = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  );
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
