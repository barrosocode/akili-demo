import { fromRef } from "@/lib/api/sanitize";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import { requireAuth } from "@/lib/auth/session";
import { laravelRequest } from "@/lib/api/laravel-client";
import type {
  ChildProgress,
  ChildReport,
  PerformanceLevel,
} from "@/types/domain/child";

type LaravelProgress = {
  student?: { name?: string };
  status?: string;
  message?: string | null;
  summary?: string | null;
  last_activity_at?: string | null;
  kpis?: Record<string, unknown>;
  materials?: Array<Record<string, unknown>>;
  reports?: Array<Record<string, unknown>>;
  school?: Record<string, unknown> | null;
  classrooms?: Array<Record<string, unknown>>;
  gamification?: Record<string, unknown> | null;
  notifications?: Array<Record<string, unknown>>;
  upcoming_content?: Array<Record<string, unknown>>;
};

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function mapReport(raw: Record<string, unknown>): ChildReport {
  return {
    period: asString(raw.period) ?? "",
    periodLabel: asString(raw.period_label) ?? asString(raw.period) ?? "",
    teacherName: asString(raw.teacher_name),
    subject: asString(raw.subject),
    summary: asString(raw.summary) ?? "",
    skillsDeveloped: asStringArray(raw.skills_developed),
    skillsInDevelopment: asStringArray(raw.skills_in_development),
    strengths: asStringArray(raw.strengths),
    difficulties: asStringArray(raw.difficulties),
    recommendations: asStringArray(raw.recommendations),
    issuedAt: asString(raw.issued_at),
    performanceLevel: asString(raw.performance_level) as PerformanceLevel | null,
  };
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ ref: string }> }
) {
  try {
    await requireAuth();
    const { ref } = await context.params;
    const uuid = fromRef(ref);

    if (!uuid) {
      return jsonError({ title: "Não encontrado", status: 404 });
    }

    const progress = await laravelRequest<LaravelProgress>(
      `/guardian/students/${uuid}/progress`
    );

    const kpis = progress.kpis ?? {};
    const gamification = progress.gamification;

    const payload: ChildProgress = {
      ref,
      name: progress.student?.name ?? "Aluno",
      status: progress.status ?? "stub",
      message: progress.message ?? null,
      summary: progress.summary ?? null,
      lastActivityAt: progress.last_activity_at ?? null,
      kpis: {
        overallPercent: asNumber(kpis.overall_percent),
        studyStreakDays: asNumber(kpis.study_streak_days),
        activitiesCompleted: asNumber(kpis.activities_completed),
        pendingLessons: asNumber(kpis.pending_lessons),
        timeStudiedMinutes:
          asNumber(kpis.time_studied_minutes) ??
          asNumber(kpis.total_study_minutes),
        totalStudyMinutes: asNumber(kpis.total_study_minutes),
        averageScore: asNumber(kpis.average_score),
        monthlyEvolutionPercent: asNumber(kpis.monthly_evolution_percent),
        weeklyEvolution: Array.isArray(kpis.weekly_evolution)
          ? kpis.weekly_evolution.filter(
              (item): item is number => typeof item === "number"
            )
          : [],
      },
      materials: (progress.materials ?? []).map((item) => ({
        packageUuid: asString(item.package_uuid),
        packageName: asString(item.package_name),
        subject: asString(item.subject),
        teacherName: asString(item.teacher_name),
        percentComplete: asNumber(item.percent_complete),
        lessonsTotal: asNumber(item.lessons_total),
        lessonsCompleted: asNumber(item.lessons_completed),
        timeStudiedMinutes: asNumber(item.time_studied_minutes),
        lastActivityAt: asString(item.last_activity_at),
        nextLesson: asString(item.next_lesson),
        performanceLevel: asString(item.performance_level),
      })),
      reports: (progress.reports ?? []).map(mapReport),
      school: progress.school
        ? {
            name: asString(progress.school.name) ?? "Escola",
            city: asString(progress.school.city),
            state: asString(progress.school.state),
            gradeLabel: asString(progress.school.grade_label),
            kind: asString(progress.school.kind),
          }
        : null,
      classrooms: (progress.classrooms ?? []).map((item) => {
        const teacher = item.teacher as Record<string, unknown> | null;
        return {
          name: asString(item.name) ?? "Turma",
          code: asString(item.code),
          status: asString(item.status) ?? "active",
          teacher: teacher
            ? {
                name: asString(teacher.name),
                specialty: asString(teacher.specialty),
              }
            : null,
        };
      }),
      gamification: gamification
        ? {
            xp: asNumber(gamification.xp) ?? 0,
            level: asNumber(gamification.level) ?? 1,
            levelName: asString(gamification.level_name) ?? "Iniciante",
            xpToNextLevel: asNumber(gamification.xp_to_next_level) ?? 0,
            streakDays: asNumber(gamification.streak_days) ?? 0,
            badges: Array.isArray(gamification.badges)
              ? gamification.badges.map((badge) => {
                  const item = badge as Record<string, unknown>;
                  return {
                    key: asString(item.key) ?? "badge",
                    name: asString(item.name) ?? "Conquista",
                    icon: asString(item.icon) ?? "🏅",
                    earnedAt: asString(item.earned_at),
                  };
                })
              : [],
            missions: Array.isArray(gamification.missions)
              ? gamification.missions.map((mission) => {
                  const item = mission as Record<string, unknown>;
                  return {
                    title: asString(item.title) ?? "Missão",
                    progress: asNumber(item.progress) ?? 0,
                    target: asNumber(item.target) ?? 1,
                    rewardXp: asNumber(item.reward_xp) ?? 0,
                    status: asString(item.status) ?? "in_progress",
                  };
                })
              : [],
            rewards: Array.isArray(gamification.rewards)
              ? gamification.rewards.map((reward) => {
                  const item = reward as Record<string, unknown>;
                  return {
                    title: asString(item.title) ?? "Recompensa",
                    unlockedAt: asString(item.unlocked_at),
                  };
                })
              : [],
          }
        : null,
      notifications: (progress.notifications ?? []).map((item) => ({
        title: asString(item.title) ?? "Aviso",
        body: asString(item.body) ?? "",
        createdAt: asString(item.created_at),
        type: asString(item.type) ?? "info",
      })),
      upcomingContent: (progress.upcoming_content ?? []).map((item) => ({
        title: asString(item.title) ?? "Próximo conteúdo",
        subject: asString(item.subject),
        packageName: asString(item.package_name),
        percentComplete: asNumber(item.percent_complete),
        teacherName: asString(item.teacher_name),
      })),
    };

    return jsonSuccess(payload);
  } catch (error) {
    return jsonError(error);
  }
}
