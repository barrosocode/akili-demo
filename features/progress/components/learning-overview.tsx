"use client";

import { format, subDays } from "date-fns";
import { useMemo, useState } from "react";

import { LearningChart } from "@/features/progress/components/learning-chart";
import { getUserFacingApiMessage } from "@/lib/api/errors";
import { BffClientError } from "@/services/bff/client";
import {
  LEARNING_CHART_SERIES,
  useChildLearningChartsQuery,
  useChildLearningKpiQuery,
} from "@/services/queries/children.queries";
import type {
  LearningChartSeries,
  LearningKpiOutcome,
  LearningQueryFilters,
  LearningSessionPosition,
} from "@/types/domain/learning";

type LearningOverviewProps = {
  childRef: string;
  enabled?: boolean;
};

type PeriodPreset = "7" | "30" | "90";

const CHART_META: Record<
  LearningChartSeries,
  { title: string; format: "ratio" | "percent" }
> = {
  time_ratio_over_time: {
    title: "Evolução da razão de tempo",
    format: "ratio",
  },
  time_ratio_by_order: {
    title: "Razão de tempo por ordem da questão",
    format: "ratio",
  },
  accuracy_over_time: {
    title: "Evolução do acerto",
    format: "percent",
  },
  accuracy_by_order: {
    title: "Acerto por ordem da questão",
    format: "percent",
  },
  accuracy_by_time_ratio: {
    title: "Acerto por faixa de razão de tempo",
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

function formatRatio(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatPercent(value: number): string {
  return `${value.toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
  })}%`;
}

export function LearningOverview({
  childRef,
  enabled = true,
}: LearningOverviewProps) {
  const [preset, setPreset] = useState<PeriodPreset>("30");
  const [outcome, setOutcome] = useState<LearningKpiOutcome>("all");
  const [sessionPosition, setSessionPosition] =
    useState<LearningSessionPosition>("all");

  const filters = useMemo(
    () => filtersFromPreset(preset, outcome, sessionPosition),
    [preset, outcome, sessionPosition]
  );

  const kpiQuery = useChildLearningKpiQuery(childRef, filters, enabled);
  const chartQueries = useChildLearningChartsQuery(childRef, filters, enabled);
  const kpi = kpiQuery.data;
  const hasResponses = (kpi?.accuracy.responses_count ?? 0) > 0;

  return (
    <section className="mb-4" aria-labelledby="learning-heading">
      <div className="widget mb-4">
        <h3 className="widget_title" id="learning-heading">
          Aprendizagem
        </h3>
        <p className="mb-3">
          Razão de tempo (resposta ÷ esperado) e porcentagem de acerto no
          período escolhido.
        </p>

        <div className="row g-3 mb-3">
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="learning-period">
              Período
            </label>
            <select
              id="learning-period"
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
            <label className="form-label" htmlFor="learning-outcome">
              Resultado
            </label>
            <select
              id="learning-outcome"
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
            <label className="form-label" htmlFor="learning-position">
              Momento da sessão
            </label>
            <select
              id="learning-position"
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
          <div className="row g-3">
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
        ) : null}
      </div>

      {LEARNING_CHART_SERIES.map((series, index) => {
        const query = chartQueries[index];
        const meta = CHART_META[series];
        const formatY =
          meta.format === "percent" ? formatPercent : formatRatio;

        if (query?.isLoading) {
          return (
            <div className="widget mb-4" key={series}>
              <h3 className="widget_title">{meta.title}</h3>
              <p className="mb-0" role="status">
                Carregando gráfico...
              </p>
            </div>
          );
        }

        if (query?.error) {
          return (
            <div className="widget mb-4" key={series}>
              <h3 className="widget_title">{meta.title}</h3>
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
            title={meta.title}
            points={query?.data?.points ?? []}
            formatY={formatY}
          />
        );
      })}
    </section>
  );
}
