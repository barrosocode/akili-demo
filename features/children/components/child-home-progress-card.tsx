"use client";

import { useMemo } from "react";

import {
  composeStudySummary,
  formatGamificationLevel,
  hasLearningAccuracy,
  lastThirtyDaysLearningFilters,
  resolveStudyStreak,
} from "@/features/progress/lib/learning-kpis";
import {
  useChildLearningKpiQuery,
  useChildLearningQuery,
  useChildProgressQuery,
} from "@/services/queries/children.queries";

type ChildHomeProgressCardProps = {
  childRef: string;
};

/**
 * Mini-resumo de progresso real + gamificação stub no card da home.
 */
export function ChildHomeProgressCard({ childRef }: ChildHomeProgressCardProps) {
  const filters = useMemo(() => lastThirtyDaysLearningFilters(), []);
  const learningQuery = useChildLearningQuery(childRef);
  const kpiQuery = useChildLearningKpiQuery(childRef, filters);
  const progressQuery = useChildProgressQuery(childRef);

  if (learningQuery.isLoading && !learningQuery.data) {
    return <p className="small mb-0">Carregando progresso...</p>;
  }

  if (learningQuery.error && !learningQuery.data) {
    return null;
  }

  const learning = learningQuery.data;
  const progress = progressQuery.data;
  const percent = learning?.kpis.overall_percent ?? null;
  const activities = learning?.kpis.activities_completed ?? null;
  const streak = resolveStudyStreak(progress);
  const hasAccuracy = hasLearningAccuracy(kpiQuery.data);
  const summary = composeStudySummary({
    activitiesCompleted: activities,
    accuracyPercent: hasAccuracy ? kpiQuery.data?.accuracy.percent ?? null : null,
    hasAccuracy,
    streakDays: streak,
  });
  const level = formatGamificationLevel(
    progress?.gamification?.level,
    progress?.gamification?.levelName
  );

  return (
    <div className="mt-2 mb-2">
      {progress?.status === "demo" ? (
        <span className="portal-chip portal-chip--muted mb-2">Demonstração</span>
      ) : null}
      {percent != null ? (
        <>
          <div className="d-flex justify-content-between small mb-1">
            <span>Progresso</span>
            <strong>{percent}%</strong>
          </div>
          <div
            className="progress mb-2"
            style={{ height: 8 }}
            aria-label="Progresso do filho"
          >
            <div className="progress-bar" style={{ width: `${percent}%` }} />
          </div>
        </>
      ) : null}
      {streak != null && streak > 0 ? (
        <p className="small mb-1">🔥 {streak} dias consecutivos</p>
      ) : null}
      {level ? <p className="small mb-1">{level}</p> : null}
      {summary ? <p className="small mb-0">{summary}</p> : null}
      {kpiQuery.isSuccess && !hasAccuracy ? (
        <p className="small mb-0">Ainda não há respostas neste período.</p>
      ) : null}
    </div>
  );
}
