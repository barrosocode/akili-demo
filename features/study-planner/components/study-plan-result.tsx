"use client";

import { formatStudyCalendarDate } from "@/features/study-board/lib/format-study-date";
import {
  OMITTED_REASON_LABELS,
  PLAN_STATUS_LABELS,
} from "@/features/study-planner/lib/labels";
import type { StudyPlanDetail } from "@/types/guardian-study-planner";

type StudyPlanResultProps = {
  plan: StudyPlanDetail;
};

export function StudyPlanResult({ plan }: StudyPlanResultProps) {
  const statusLabel = PLAN_STATUS_LABELS[plan.status];

  return (
    <div className="widget mb-4" id="resultado-plano">
      <h3 className="widget_title">Resultado do roteiro</h3>
      <p className="mb-2">
        <span className="portal-chip">{statusLabel}</span>
      </p>
      <p className="mb-2">
        De {formatStudyCalendarDate(plan.starts_on)} até{" "}
        {formatStudyCalendarDate(plan.content_deadline_on)}.
        {plan.task_count > 0 ? ` ${plan.task_count} atividades no quadro.` : ""}
      </p>

      {plan.status === "failed" ? (
        <div className="alert alert-danger" role="alert">
          Não foi possível montar o roteiro. Ajuste os horários ou os tópicos e
          gere de novo.
        </div>
      ) : null}

      {plan.warnings.length > 0 ? (
        <div className="alert alert-warning" role="status">
          <strong>O que o sistema ajustou</strong>
          <ul className="mb-0 mt-2">
            {plan.warnings.map((warning) => (
              <li key={warning.code}>
                {warning.message}
                {warning.action_taken ? ` ${warning.action_taken}` : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {plan.omitted_topics.length > 0 ? (
        <div className="alert alert-info" role="status">
          <strong>Não entrou no quadro</strong>
          <ul className="mb-0 mt-2">
            {plan.omitted_topics.map((topic, index) => (
              <li key={`${topic.reason}-${index}`}>
                {OMITTED_REASON_LABELS[topic.reason] ?? "Este tópico não entrou no quadro."}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {plan.status === "applied" ? (
        <p className="mb-0">
          Acompanhe o quadro do aluno nas colunas abaixo.
        </p>
      ) : null}
    </div>
  );
}
