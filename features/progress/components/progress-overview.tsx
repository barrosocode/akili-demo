import { formatMinutes } from "@/features/progress/lib/labels";
import type { ChildKpis } from "@/types/domain/child";

type ProgressOverviewProps = {
  kpis: ChildKpis;
  summary: string | null;
};

export function ProgressOverview({ kpis, summary }: ProgressOverviewProps) {
  const overall = kpis.overallPercent ?? 0;

  return (
    <div className="widget mb-4">
      <h3 className="widget_title">Progresso geral</h3>
      {summary ? <p>{summary}</p> : null}
      <div className="mb-3">
        <div className="d-flex justify-content-between mb-1">
          <span>Conclusão</span>
          <strong>{overall}%</strong>
        </div>
        <div
          className="progress"
          role="progressbar"
          aria-valuenow={overall}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progresso geral"
        >
          <div className="progress-bar" style={{ width: `${overall}%` }} />
        </div>
      </div>
      <div className="row g-3">
        <div className="col-6 col-md-3">
          <strong>{kpis.activitiesCompleted ?? "—"}</strong>
          <div>Atividades</div>
        </div>
        <div className="col-6 col-md-3">
          <strong>{kpis.studyStreakDays ?? "—"}</strong>
          <div>Dias seguidos</div>
        </div>
        <div className="col-6 col-md-3">
          <strong>{formatMinutes(kpis.timeStudiedMinutes)}</strong>
          <div>Tempo estudado</div>
        </div>
        <div className="col-6 col-md-3">
          <strong>
            {kpis.averageScore != null ? `${kpis.averageScore}%` : "—"}
          </strong>
          <div>Desempenho</div>
        </div>
      </div>
    </div>
  );
}
