import { LearningLineChart } from "@/features/progress/components/learning-line-chart";
import type { LearningChartPoint } from "@/types/domain/learning";

type LearningChartProps = {
  title: string;
  points: LearningChartPoint[];
  formatY?: (value: number) => string;
  emptyLabel?: string;
  variant?: "bar" | "line" | "cards";
  yScale?: "auto" | "percent";
};

function formatBandNumber(raw: string): string {
  const value = Number(raw);
  if (!Number.isFinite(value)) return raw;
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  });
}

function formatTimeRatioBand(value: string | number): string {
  const raw = String(value).trim();
  const openEnded = /^(\d+(?:\.\d+)?)\+$/.exec(raw);
  if (openEnded?.[1]) return `${formatBandNumber(openEnded[1])} ou mais`;
  const range = /^(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)$/.exec(raw);
  if (range?.[1] && range[2]) {
    return `${formatBandNumber(range[1])} a ${formatBandNumber(range[2])}`;
  }
  return raw;
}

function LearningBandCards({
  points,
  formatY,
}: {
  points: LearningChartPoint[];
  formatY: (value: number) => string;
}) {
  return (
    <ul className="learning-band-cards">
      {points.map((point, index) => {
        const range = formatTimeRatioBand(point.x);
        const percent =
          point.y === null || !Number.isFinite(point.y) ? "—" : formatY(point.y);
        return (
          <li className="learning-band-card" key={`${point.x}-${index}`}>
            <p className="learning-band-card__range">{range}</p>
            <p className="learning-band-card__value">{percent}</p>
          </li>
        );
      })}
    </ul>
  );
}

export function LearningChart({
  title,
  points,
  formatY = (value) => String(value),
  emptyLabel = "Ainda não há respostas neste período.",
  variant = "bar",
  yScale = "auto",
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
      ) : variant === "line" ? (
        <LearningLineChart
          title={title}
          points={points}
          formatY={formatY}
          yScale={yScale}
        />
      ) : variant === "cards" ? (
        <LearningBandCards points={points} formatY={formatY} />
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
