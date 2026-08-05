"use client";

import { useChildProgressQuery } from "@/services/queries/children.queries";

type ChildHomeProgressCardProps = {
  childRef: string;
};

/**
 * Mini-resumo de progresso/gamificação no card da home.
 */
export function ChildHomeProgressCard({ childRef }: ChildHomeProgressCardProps) {
  const { data, isLoading, error } = useChildProgressQuery(childRef);

  if (isLoading) {
    return <p className="small mb-0">Carregando progresso...</p>;
  }

  if (error || !data) {
    return null;
  }

  const percent = data.kpis.overallPercent;
  const streak =
    data.gamification?.streakDays ?? data.kpis.studyStreakDays ?? null;
  const level = data.gamification
    ? `Nível ${data.gamification.level} · ${data.gamification.levelName}`
    : null;

  return (
    <div className="mt-2 mb-2">
      {data.status === "demo" ? (
        <span className="badge bg-secondary mb-2">Demonstração</span>
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
      {streak != null ? (
        <p className="small mb-1">🔥 {streak} dias consecutivos</p>
      ) : null}
      {level ? <p className="small mb-1">{level}</p> : null}
      {data.summary ? <p className="small mb-0">{data.summary}</p> : null}
    </div>
  );
}
