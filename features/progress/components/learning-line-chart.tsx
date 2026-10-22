"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";

import type { LearningChartPoint } from "@/types/domain/learning";

type LearningLineScale = "auto" | "percent";

type LearningLineChartProps = {
  title: string;
  points: LearningChartPoint[];
  formatY: (value: number) => string;
  yScale?: LearningLineScale;
};

type PlotPoint = {
  x: number;
  y: number;
};

const CHART_HEIGHT = 228;

function niceMax(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 1;
  const padded = value * 1.1;
  const exponent = Math.floor(Math.log10(padded));
  const magnitude = 10 ** exponent;
  const fraction = padded / magnitude;
  const niceFraction =
    fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return niceFraction * magnitude;
}

function domainMax(values: number[], scale: LearningLineScale): number {
  const peak = Math.max(...values, 0);
  if (scale === "percent") return Math.max(100, peak);
  return niceMax(peak);
}

function formatAxisLabel(value: string | number): string {
  if (typeof value === "number") return String(value);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  return `${match[3]}/${match[2]}`;
}

function formatReadoutLabel(value: string | number): string {
  if (typeof value === "number" || /^\d+$/.test(value)) {
    return `Questão ${value}`;
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  return `${match[3]}/${match[2]}/${match[1]}`;
}

function responsesLabel(count: number): string {
  return count === 1 ? "1 resposta" : `${count} respostas`;
}

function pointValue(point: LearningChartPoint | undefined): number | null {
  if (!point || point.y === null || !Number.isFinite(point.y)) return null;
  return point.y;
}

function labelIndexes(count: number, plotWidth: number): number[] {
  if (count <= 1) return [0];
  const maxLabels = Math.max(2, Math.floor(plotWidth / 64));
  if (count <= maxLabels) {
    return Array.from({ length: count }, (_, index) => index);
  }
  const indexes = new Set<number>();
  for (let slot = 0; slot < maxLabels; slot += 1) {
    indexes.add(Math.round((slot * (count - 1)) / (maxLabels - 1)));
  }
  return [...indexes].sort((left, right) => left - right);
}

function labelAnchor(
  index: number,
  lastIndex: number
): "start" | "middle" | "end" {
  if (lastIndex <= 0) return "middle";
  if (index <= 0) return "start";
  if (index >= lastIndex) return "end";
  return "middle";
}

function buildPaths(
  coords: Array<PlotPoint | null>,
  baseline: number
): { line: string; area: string } {
  let line = "";
  let area = "";
  let run: PlotPoint[] = [];

  const flush = () => {
    const first = run[0];
    const last = run[run.length - 1];
    if (!first || !last) {
      run = [];
      return;
    }
    line += `M${first.x.toFixed(1)},${first.y.toFixed(1)}`;
    for (const point of run.slice(1)) {
      line += `L${point.x.toFixed(1)},${point.y.toFixed(1)}`;
    }
    if (run.length > 1) {
      area += `M${first.x.toFixed(1)},${first.y.toFixed(1)}`;
      for (const point of run.slice(1)) {
        area += `L${point.x.toFixed(1)},${point.y.toFixed(1)}`;
      }
      area += `L${last.x.toFixed(1)},${baseline.toFixed(1)}L${first.x.toFixed(1)},${baseline.toFixed(1)}Z`;
    }
    run = [];
  };

  for (const coord of coords) {
    if (!coord) {
      flush();
      continue;
    }
    run.push(coord);
  }
  flush();
  return { line, area };
}

function useElementWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => {
      const next = element.clientWidth;
      setWidth((current) => (Math.abs(current - next) < 1 ? current : next));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}

export function LearningLineChart({
  title,
  points,
  formatY,
  yScale = "auto",
}: LearningLineChartProps) {
  const { ref, width } = useElementWidth();
  const readoutId = useId();
  const pointsKey = points.map((point) => `${point.x}:${point.y}:${point.n}`).join("|");
  const [selection, setSelection] = useState<{ key: string; index: number } | null>(
    null
  );

  const numericIndexes = points.flatMap((point, index) =>
    pointValue(point) === null ? [] : [index]
  );
  const fallbackIndex = numericIndexes[numericIndexes.length - 1] ?? -1;
  const activeIndex =
    selection?.key === pointsKey && numericIndexes.includes(selection.index)
      ? selection.index
      : fallbackIndex;
  const activePoint = activeIndex >= 0 ? points[activeIndex] : undefined;
  const activeValue = pointValue(activePoint);

  const values = numericIndexes.map((index) => pointValue(points[index]) ?? 0);
  const max = domainMax(values, yScale);
  const ticks = [0, 1, 2, 3, 4].map((step) => (max * step) / 4);
  const longestTick = Math.max(...ticks.map((tick) => formatY(tick).length), 2);
  const padLeft = Math.max(48, longestTick * 8 + 16);
  const pad = { top: 16, right: 8, bottom: 32, left: padLeft };
  const plotLeft = pad.left + 8;
  const plotRight = Math.max(plotLeft + 1, width - pad.right - 8);
  const plotWidth = plotRight - plotLeft;
  const plotHeight = CHART_HEIGHT - pad.top - pad.bottom;
  const baseline = pad.top + plotHeight;

  const yAt = (value: number) => {
    if (max <= 0) return baseline;
    const clamped = Math.min(max, Math.max(0, value));
    return baseline - (clamped / max) * plotHeight;
  };

  const xAt = (index: number) => {
    if (points.length <= 1) return plotLeft + plotWidth / 2;
    return plotLeft + (index / (points.length - 1)) * plotWidth;
  };

  const coords = points.map((point, index) => {
    const value = pointValue(point);
    if (value === null) return null;
    return { x: xAt(index), y: yAt(value) };
  });
  const paths = buildPaths(coords, baseline);
  const visibleLabels = labelIndexes(points.length, plotWidth);
  const dense = points.length > 24;

  function selectIndex(index: number) {
    if (pointValue(points[index]) === null) return;
    setSelection({ key: pointsKey, index });
  }

  function selectFromPointer(event: React.PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width <= 0) return;
    const x = ((event.clientX - rect.left) / rect.width) * width;
    let best = -1;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (const index of numericIndexes) {
      const distance = Math.abs(xAt(index) - x);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = index;
      }
    }
    if (best >= 0) selectIndex(best);
  }

  function moveSelection(direction: 1 | -1) {
    const position = numericIndexes.indexOf(activeIndex);
    const next = numericIndexes[position + direction];
    if (next == null) return;
    selectIndex(next);
  }

  return (
    <div className="learning-chart__plot" ref={ref}>
      {width > 0 ? (
        <div
          className="learning-chart__canvas"
          tabIndex={0}
          role="group"
          aria-label={`${title}. Use as setas para ver cada ponto.`}
          aria-describedby={readoutId}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowDown") {
              event.preventDefault();
              moveSelection(1);
            } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
              event.preventDefault();
              moveSelection(-1);
            } else if (event.key === "Home") {
              event.preventDefault();
              const first = numericIndexes[0];
              if (first != null) selectIndex(first);
            } else if (event.key === "End") {
              event.preventDefault();
              const last = numericIndexes[numericIndexes.length - 1];
              if (last != null) selectIndex(last);
            }
          }}
        >
          <svg
            width={width}
            height={CHART_HEIGHT}
            viewBox={`0 0 ${width} ${CHART_HEIGHT}`}
            role="presentation"
            aria-hidden="true"
            onPointerDown={(event) => {
              if (event.pointerType === "mouse") {
                event.currentTarget.setPointerCapture(event.pointerId);
              }
              selectFromPointer(event);
            }}
            onPointerMove={(event) => {
              if (event.pointerType !== "mouse" || (event.buttons & 1) === 0) return;
              selectFromPointer(event);
            }}
          >
            {ticks.slice(1).map((tick) => (
              <line
                key={tick}
                x1={plotLeft}
                x2={plotRight}
                y1={yAt(tick)}
                y2={yAt(tick)}
                stroke="#c5d0dc"
                strokeWidth={1}
              />
            ))}
            <line
              x1={plotLeft}
              x2={plotRight}
              y1={baseline}
              y2={baseline}
              stroke="#aebaca"
              strokeWidth={1}
            />
            {ticks.map((tick) => (
              <text
                key={`label-${tick}`}
                x={pad.left - 8}
                y={yAt(tick)}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={12}
                fill="#3d4a5c"
              >
                {formatY(tick)}
              </text>
            ))}
            {paths.area ? (
              <path d={paths.area} fill="var(--theme-color, #df5c16)" fillOpacity={0.14} />
            ) : null}
            {paths.line ? (
              <path
                d={paths.line}
                fill="none"
                stroke="var(--theme-color, #df5c16)"
                strokeWidth={2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ) : null}
            {activeIndex >= 0 ? (
              <line
                x1={xAt(activeIndex)}
                x2={xAt(activeIndex)}
                y1={pad.top}
                y2={baseline}
                stroke="var(--theme-color, #df5c16)"
                strokeOpacity={0.35}
                strokeDasharray="3 4"
              />
            ) : null}
            {coords.map((coord, index) => {
              if (!coord) return null;
              if (dense && index !== activeIndex) return null;
              const selected = index === activeIndex;
              return (
                <circle
                  key={`${points[index]?.x ?? index}-${index}`}
                  cx={coord.x}
                  cy={coord.y}
                  r={selected ? 5.5 : 3.5}
                  fill="var(--theme-color, #df5c16)"
                  stroke="#fff"
                  strokeWidth={selected ? 2 : 1.5}
                />
              );
            })}
            {visibleLabels.map((index) => {
              const point = points[index];
              if (!point) return null;
              return (
                <text
                  key={`x-${point.x}-${index}`}
                  x={xAt(index)}
                  y={CHART_HEIGHT - 8}
                  textAnchor={labelAnchor(index, points.length - 1)}
                  fontSize={12}
                  fill="#3d4a5c"
                >
                  {formatAxisLabel(point.x)}
                </text>
              );
            })}
          </svg>
        </div>
      ) : (
        <div className="learning-chart__canvas" />
      )}

      <p className="learning-chart__readout" id={readoutId} aria-live="polite">
        {activePoint && activeValue !== null ? (
          <>
            <span>{formatReadoutLabel(activePoint.x)}</span>
            <strong>{formatY(activeValue)}</strong>
            <span>{responsesLabel(activePoint.n)}</span>
          </>
        ) : null}
      </p>

      <ul className="learning-chart__summary">
        {points.map((point, index) => {
          const value = pointValue(point);
          return (
            <li key={`${point.x}-${index}`}>
              {formatReadoutLabel(point.x)}
              {": "}
              {value === null
                ? "sem dados"
                : `${formatY(value)}, ${responsesLabel(point.n)}`}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
