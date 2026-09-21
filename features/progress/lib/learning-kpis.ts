import { format, subDays } from "date-fns";

import type { ChildMaterial, ChildProgress } from "@/types/domain/child";
import type { LearningKpi, LearningQueryFilters } from "@/types/domain/learning";
import type { StudentDashboard } from "@/types/student-learning";

export function lastThirtyDaysLearningFilters(): LearningQueryFilters {
  const to = new Date();
  const from = subDays(to, 29);
  return {
    date_from: format(from, "yyyy-MM-dd"),
    date_to: format(to, "yyyy-MM-dd"),
    outcome: "all",
    session_position: "all",
  };
}

export function hasLearningAccuracy(
  kpi: LearningKpi | null | undefined
): boolean {
  if (!kpi) return false;
  return kpi.accuracy.percent != null && kpi.accuracy.responses_count > 0;
}

export function composeStudySummary(input: {
  activitiesCompleted: number | null;
  accuracyPercent: number | null;
  hasAccuracy: boolean;
  streakDays: number | null;
}): string | null {
  const parts: string[] = [];

  if (input.activitiesCompleted != null) {
    parts.push(
      input.activitiesCompleted === 1
        ? "1 atividade concluída"
        : `${input.activitiesCompleted} atividades concluídas`
    );
  }

  if (input.hasAccuracy && input.accuracyPercent != null) {
    const formatted = input.accuracyPercent.toLocaleString("pt-BR", {
      maximumFractionDigits: 1,
    });
    parts.push(`média de ${formatted}%`);
  }

  if (input.streakDays != null && input.streakDays > 0) {
    parts.push(
      input.streakDays === 1
        ? "1 dia consecutivo de estudo"
        : `${input.streakDays} dias consecutivos de estudo`
    );
  }

  if (!parts.length) return null;
  return `Resumo: ${parts.join(" · ")}.`;
}

export function resolveStudyStreak(
  progress: ChildProgress | null | undefined
): number | null {
  const fromGame = progress?.gamification?.streakDays;
  if (fromGame != null && fromGame > 0) return fromGame;
  const fromKpi = progress?.kpis.studyStreakDays;
  if (fromKpi != null && fromKpi > 0) return fromKpi;
  return fromGame ?? fromKpi ?? null;
}

export function formatRatio(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatPercent(value: number): string {
  return `${value.toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
  })}%`;
}

export function formatSecondsLabel(seconds: number | null | undefined): string {
  if (seconds == null || !Number.isFinite(seconds)) {
    return "—";
  }
  return `${seconds.toLocaleString("pt-BR", {
    minimumFractionDigits: seconds < 10 ? 1 : 0,
    maximumFractionDigits: 1,
  })} s`;
}

export function formatResponseTimeMs(ms: number | null | undefined): string {
  if (ms == null || !Number.isFinite(ms)) return "—";
  return formatSecondsLabel(ms / 1000);
}

export function formatGamificationLevel(
  level: number | null | undefined,
  levelName: string | null | undefined
): string | null {
  if (level == null || level <= 0) return null;
  if (!levelName) return `Nível ${level}`;
  return `Nível ${level} · ${levelName}`;
}

export function materialsFromLearning(
  dashboard: StudentDashboard
): ChildMaterial[] {
  return dashboard.materials.map((item) => ({
    packageUuid: item.package.uuid,
    packageName: item.package.name,
    subject: item.content.subject?.name ?? item.content.name,
    teacherName: item.teacher?.name ?? null,
    percentComplete: item.progress.percent_complete,
    lessonsTotal: item.lesson_count,
    lessonsCompleted: null,
    timeStudiedMinutes: Math.round(item.progress.time_studied_seconds / 60),
    lastActivityAt: item.progress.last_activity_at,
    nextLesson: item.content.name,
    performanceLevel: null,
  }));
}
