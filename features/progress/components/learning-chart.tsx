import type { LearningChartPoint } from "@/types/domain/learning";

type LearningChartProps = {
  title: string;
  points: LearningChartPoint[];
  formatY?: (value: number) => string;
  emptyLabel?: string;
};

export function LearningChart({
  title,
  points,
  formatY = (value) => String(value),
  emptyLabel = "Ainda não há respostas neste período.",
}: LearningChartProps) {
  const numericPoints = points.filter(
    (point) => point.y !== null && Number.isFinite(point.y)
  );
  const max = Math.max(
    ...numericPoints.map((point) => Math.abs(point.y ?? 0)),
    1
  );

  return (
    <div className="widget mb-4">
      <h3 className="widget_title">{title}</h3>
      {!numericPoints.length ? (
        <p className="mb-0">{emptyLabel}</p>
      ) : (
        <div
          className="d-flex align-items-end gap-2 overflow-auto"
          style={{ minHeight: 120 }}
          role="img"
          aria-label={title}
        >
          {points.map((point, index) => {
            const value = point.y;
            const height =
              value === null
                ? 8
                : Math.max(8, Math.round((Math.abs(value) / max) * 100));
            return (
              <div
                key={`${point.x}-${index}`}
                className="text-center flex-fill"
                style={{ minWidth: 36 }}
              >
                <div
                  className="mx-auto rounded"
                  style={{
                    height,
                    width: "70%",
                    background: "var(--theme-color, #2d6cdf)",
                    opacity: value === null ? 0.25 : 0.85,
                  }}
                  title={
                    value === null
                      ? `${point.x}: sem dados`
                      : `${point.x}: ${formatY(value)} (${point.n})`
                  }
                />
                <small className="d-block mt-1">{point.x}</small>
                <small>
                  <strong>
                    {value === null ? "—" : formatY(value)}
                  </strong>
                </small>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
