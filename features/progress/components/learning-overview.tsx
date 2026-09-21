"use client";

import { format, subDays } from "date-fns";
import { useMemo, useState } from "react";

import { LearningChart } from "@/features/progress/components/learning-chart";
import {
  formatPercent,
  formatRatio,
  formatResponseTimeMs,
  formatSecondsLabel,
} from "@/features/progress/lib/learning-kpis";
import { getUserFacingApiMessage } from "@/lib/api/errors";
import { BffClientError } from "@/services/bff/client";
import {
  useChildLearningChartsQuery,
  useChildLearningKpiQuery,
} from "@/services/queries/children.queries";
import {
  useStudentLearningChartsQuery,
  useStudentLearningKpiQuery,
} from "@/services/queries/student.queries";
import {
  LEARNING_CHART_SERIES,
  type LearningChartSeries,
  type LearningKpi,
  type LearningKpiOutcome,
  type LearningQueryFilters,
  type LearningSessionPosition,
} from "@/types/domain/learning";

type LearningOverviewProps = {
  source?: "guardian" | "student";
  childRef?: string;
  enabled?: boolean;
};

type PeriodPreset = "7" | "30" | "90";

const CHART_META: Record<
  LearningChartSeries,
  { title: string; studentTitle: string; format: "ratio" | "percent" }
> = {
  time_ratio_over_time: {
    title: "Evolução da razão de tempo",
    studentTitle: "Tempo de resposta ao longo dos dias",
    format: "ratio",
  },
  time_ratio_by_order: {
    title: "Razão de tempo por ordem da questão",
    studentTitle: "Tempo de resposta em cada questão",
    format: "ratio",
  },
  accuracy_over_time: {
    title: "Evolução do acerto",
    studentTitle: "Porcentagem de acerto ao longo dos dias",
    format: "percent",
  },
  accuracy_by_order: {
    title: "Acerto por ordem da questão",
    studentTitle: "Porcentagem de acerto em cada questão",
    format: "percent",
  },
  accuracy_by_time_ratio: {
    title: "Acerto por faixa de razão de tempo",
    studentTitle: "Acerto conforme o tempo de resposta",
    format: "percent",
  },
};

function isoDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

function filtersFromPreset(
  preset: PeriodPreset,
  outcome: LearningKpiOutcome,
  sessionPosition: LearningSessionPosition
): LearningQueryFilters {
  const to = new Date();
  const from = subDays(to, Number(preset) - 1);
  return {
    date_from: isoDate(from),
    date_to: isoDate(to),
    outcome,
    session_position: sessionPosition,
  };
}

function TimeComparison({ kpi }: { kpi: LearningKpi }) {
  const responseSeconds =
    kpi.time_ratio.avg_response_time_ms == null
      ? null
      : kpi.time_ratio.avg_response_time_ms / 1000;
  const expectedSeconds = kpi.time_ratio.avg_expected_time_seconds;
  const max = Math.max(responseSeconds ?? 0, expectedSeconds ?? 0, 1);
  const responseWidth =
    responseSeconds == null
      ? 8
      : Math.max(8, Math.round((responseSeconds / max) * 100));
  const expectedWidth =
    expectedSeconds == null
      ? 8
      : Math.max(8, Math.round((expectedSeconds / max) * 100));

  return (
    <div className="row g-3 mt-1">
      <div className="col-12 col-md-6">
        <div className="d-flex justify-content-between mb-1">
          <span>Tempo de resposta</span>
          <strong>{formatResponseTimeMs(kpi.time_ratio.avg_response_time_ms)}</strong>
        </div>
        <div
          className="progress"
          role="progressbar"
          aria-label="Tempo médio de resposta"
          aria-valuenow={responseSeconds ?? 0}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          <div className="progress-bar" style={{ width: `${responseWidth}%` }} />
        </div>
      </div>
      <div className="col-12 col-md-6">
        <div className="d-flex justify-content-between mb-1">
          <span>Tempo esperado</span>
          <strong>{formatSecondsLabel(expectedSeconds)}</strong>
        </div>
        <div
          className="progress"
          role="progressbar"
          aria-label="Tempo esperado"
          aria-valuenow={expectedSeconds ?? 0}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          <div
            className="progress-bar"
            style={{ width: `${expectedWidth}%`, opacity: 0.55 }}
          />
        </div>
      </div>
    </div>
  );
}

export function LearningOverview({
  childRef,
  source = childRef ? "guardian" : "student",
  enabled = true,
}: LearningOverviewProps) {
  const isStudent = source === "student";
  const [preset, setPreset] = useState<PeriodPreset>("30");
  const [outcome, setOutcome] = useState<LearningKpiOutcome>("all");
  const [sessionPosition, setSessionPosition] =
    useState<LearningSessionPosition>("all");

  const filters = useMemo(
    () => filtersFromPreset(preset, outcome, sessionPosition),
    [preset, outcome, sessionPosition]
  );

  const studentKpiQuery = useStudentLearningKpiQuery(
    filters,
    isStudent && enabled
  );
  const guardianKpiQuery = useChildLearningKpiQuery(
    childRef ?? "",
    filters,
    !isStudent && enabled
  );
  const studentChartQueries = useStudentLearningChartsQuery(
    filters,
    isStudent && enabled
  );
  const guardianChartQueries = useChildLearningChartsQuery(
    childRef ?? "",
    filters,
    !isStudent && enabled
  );

  const kpiQuery = isStudent ? studentKpiQuery : guardianKpiQuery;
  const chartQueries = isStudent ? studentChartQueries : guardianChartQueries;
  const kpi = kpiQuery.data;
  const hasResponses = (kpi?.accuracy.responses_count ?? 0) > 0;
  const accuracyPercent = kpi?.accuracy.percent ?? 0;
  const idPrefix = isStudent ? "student-learning" : "learning";

  return (
    <section className="mb-4" aria-labelledby={`${idPrefix}-heading`}>
      <div className="widget mb-4">
        <h3 className="widget_title" id={`${idPrefix}-heading`}>
          {isStudent ? "Como você está indo" : "Aprendizagem"}
        </h3>
        <p className="mb-3">
          {isStudent
            ? "Compare o tempo que você levou para responder com o tempo esperado e veja quantas questões você acertou."
            : "Razão de tempo (resposta ÷ esperado) e porcentagem de acerto no período escolhido."}
        </p>

        <div className="row g-3 mb-3">
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor={`${idPrefix}-period`}>
              Período
            </label>
            <select
              id={`${idPrefix}-period`}
              className="form-control"
              value={preset}
              onChange={(event) =>
                setPreset(event.target.value as PeriodPreset)
              }
            >
              <option value="7">Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option>
              <option value="90">Últimos 90 dias</option>
            </select>
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor={`${idPrefix}-outcome`}>
              Resultado
            </label>
            <select
              id={`${idPrefix}-outcome`}
              className="form-control"
              value={outcome}
              onChange={(event) =>
                setOutcome(event.target.value as LearningKpiOutcome)
              }
            >
              <option value="all">Todas as respostas</option>
              <option value="correct">Somente acertos</option>
              <option value="incorrect">Somente erros</option>
            </select>
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor={`${idPrefix}-position`}>
              Momento da sessão
            </label>
            <select
              id={`${idPrefix}-position`}
              className="form-control"
              value={sessionPosition}
              onChange={(event) =>
                setSessionPosition(
                  event.target.value as LearningSessionPosition
                )
              }
            >
              <option value="all">Toda a sessão</option>
              <option value="start">Início</option>
              <option value="middle">Meio</option>
              <option value="end">Fim</option>
            </select>
          </div>
        </div>

        {kpiQuery.isLoading ? (
          <p role="status">Carregando aprendizagem...</p>
        ) : null}

        {kpiQuery.error ? (
          <p style={{ color: "red" }} role="alert">
            {kpiQuery.error instanceof BffClientError
              ? (kpiQuery.error.detail ?? kpiQuery.error.title)
              : getUserFacingApiMessage(kpiQuery.error)}
          </p>
        ) : null}

        {kpi && !hasResponses ? (
          <div className="alert alert-info mb-0" role="status">
            Ainda não há respostas neste período.
          </div>
        ) : null}

        {kpi && hasResponses ? (
          <>
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span>Porcentagem de acerto</span>
                <strong>
                  {kpi.accuracy.percent === null
                    ? "—"
                    : formatPercent(kpi.accuracy.percent)}
                </strong>
              </div>
              <div
                className="progress"
                role="progressbar"
                aria-label="Porcentagem de acerto"
                aria-valuenow={accuracyPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="progress-bar"
                  style={{ width: `${Math.max(0, Math.min(100, accuracyPercent))}%` }}
                />
              </div>
            </div>

            <TimeComparison kpi={kpi} />

            <div className="row g-3 mt-2">
              <div className="col-6 col-md-3">
                <strong style={{ fontSize: "1.35rem" }}>
                  {kpi.time_ratio.avg === null
                    ? "—"
                    : formatRatio(kpi.time_ratio.avg)}
                </strong>
                <div>Razão média de tempo</div>
              </div>
              <div className="col-6 col-md-3">
                <strong style={{ fontSize: "1.35rem" }}>
                  {kpi.accuracy.percent === null
                    ? "—"
                    : formatPercent(kpi.accuracy.percent)}
                </strong>
                <div>Porcentagem de acerto</div>
              </div>
              <div className="col-6 col-md-3">
                <strong style={{ fontSize: "1.35rem" }}>
                  {kpi.accuracy.correct_count}
                </strong>
                <div>Acertos</div>
              </div>
              <div className="col-6 col-md-3">
                <strong style={{ fontSize: "1.35rem" }}>
                  {kpi.accuracy.incorrect_count}
                </strong>
                <div>Erros</div>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {LEARNING_CHART_SERIES.map((series, index) => {
        const query = chartQueries[index];
        const meta = CHART_META[series];
        const title = isStudent ? meta.studentTitle : meta.title;
        const formatY =
          meta.format === "percent" ? formatPercent : formatRatio;

        if (query?.isLoading) {
          return (
            <div className="widget mb-4" key={series}>
              <h3 className="widget_title">{title}</h3>
              <p className="mb-0" role="status">
                Carregando gráfico...
              </p>
            </div>
          );
        }

        if (query?.error) {
          return (
            <div className="widget mb-4" key={series}>
              <h3 className="widget_title">{title}</h3>
              <p className="mb-0" style={{ color: "red" }} role="alert">
                {query.error instanceof BffClientError
                  ? (query.error.detail ?? query.error.title)
                  : getUserFacingApiMessage(query.error)}
              </p>
            </div>
          );
        }

        return (
          <LearningChart
            key={series}
            title={title}
            points={query?.data?.points ?? []}
            formatY={formatY}
          />
        );
      })}
    </section>
  );
}
