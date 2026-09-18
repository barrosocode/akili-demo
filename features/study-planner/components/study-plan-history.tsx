"use client";

import { formatStudyCalendarDate } from "@/features/study-board/lib/format-study-date";
import { PLAN_STATUS_LABELS } from "@/features/study-planner/lib/labels";
import { useGuardianStudyPlansQuery } from "@/services/queries/guardian-study-planner.queries";

type StudyPlanHistoryProps = {
  childRef: string;
  enabled: boolean;
};

export function StudyPlanHistory({ childRef, enabled }: StudyPlanHistoryProps) {
  const query = useGuardianStudyPlansQuery(childRef, 1, enabled);
  const plans = query.data?.items ?? [];

  if (query.isLoading) {
    return <p role="status">Carregando histórico...</p>;
  }

  if (!plans.length) {
    return (
      <p className="mb-0 text-muted">
        Ainda não há roteiros gerados para este aluno.
      </p>
    );
  }

  return (
    <ul className="list-unstyled mb-0">
      {plans.map((plan) => (
        <li key={plan.uuid} className="mb-3">
          <strong>{PLAN_STATUS_LABELS[plan.status]}</strong>
          <div>
            {formatStudyCalendarDate(plan.starts_on)} —{" "}
            {formatStudyCalendarDate(plan.content_deadline_on)}
          </div>
          {plan.warnings_count > 0 ? (
            <div className="small">
              {plan.warnings_count === 1
                ? "1 aviso"
                : `${plan.warnings_count} avisos`}
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
