import { formatMinutes } from "@/features/progress/lib/labels";

type ProgressOverviewProps = {
  overallPercent: number | null;
  activitiesCompleted: number | null;
  studyStreakDays: number | null;
  timeStudiedMinutes: number | null;
  accuracyPercent: number | null;
  summary: string | null;
};

function formatAccuracy(value: number): string {
  return `${value.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
}

export function ProgressOverview({
  overallPercent,
  activitiesCompleted,
  studyStreakDays,
  timeStudiedMinutes,
  accuracyPercent,
  summary,
}: ProgressOverviewProps) {
  const overall = overallPercent ?? 0;

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
          <strong>{activitiesCompleted ?? "—"}</strong>
          <div>Atividades</div>
        </div>
        <div className="col-6 col-md-3">
          <strong>{studyStreakDays ?? "—"}</strong>
          <div>Dias seguidos</div>
        </div>
        <div className="col-6 col-md-3">
          <strong>{formatMinutes(timeStudiedMinutes)}</strong>
          <div>Tempo estudado</div>
        </div>
        <div className="col-6 col-md-3">
          <strong>
            {accuracyPercent != null ? formatAccuracy(accuracyPercent) : "—"}
          </strong>
          <div>Média</div>
        </div>
      </div>
    </div>
  );
}
