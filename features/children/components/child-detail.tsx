"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { GamificationPanel } from "@/features/gamification";
import {
  PendingMaterials,
  ProgressBySubject,
  ProgressOverview,
  PerformanceBadge,
  LearningOverview,
} from "@/features/progress";
import {
  composeStudySummary,
  hasLearningAccuracy,
  lastThirtyDaysLearningFilters,
  materialsFromLearning,
  resolveStudyStreak,
} from "@/features/progress/lib/learning-kpis";
import { getUserFacingApiMessage } from "@/lib/api/errors";
import { useSession } from "@/providers/session-provider";
import { BffClientError } from "@/services/bff/client";
import {
  useChildLearningKpiQuery,
  useChildLearningQuery,
  useChildProgressQuery,
  useChildrenQuery,
} from "@/services/queries/children.queries";

type ChildDetailProps = {
  childRef: string;
};

type TabId = "overview" | "reports" | "achievements";

/**
 * Detalhe do filho — progresso, materiais, relatórios e conquistas via API.
 */
export function ChildDetail({ childRef }: ChildDetailProps) {
  const { user, setActiveChildRef } = useSession();
  const { data, isLoading, error } = useChildrenQuery();
  const children = data ?? user?.children ?? [];
  const child = children.find((item) => item.ref === childRef);
  const canViewProgress = child?.canViewProgress ?? false;

  const canLoadLearning = Boolean(child) && canViewProgress;
  const progressQuery = useChildProgressQuery(childRef, canLoadLearning);
  const learningQuery = useChildLearningQuery(childRef, canLoadLearning);
  const kpiFilters = useMemo(() => lastThirtyDaysLearningFilters(), []);
  const kpiQuery = useChildLearningKpiQuery(childRef, kpiFilters, canLoadLearning);
  const [tab, setTab] = useState<TabId>("overview");

  useEffect(() => {
    if (child?.ref) {
      setActiveChildRef(child.ref);
    }
  }, [child?.ref, setActiveChildRef]);

  const reports = progressQuery.data?.reports ?? [];
  const [period, setPeriod] = useState("");

  useEffect(() => {
    if (reports.length && !period) {
      setPeriod(reports[0]?.period ?? "");
    }
  }, [reports, period]);

  const selectedReport = useMemo(
    () => reports.find((item) => item.period === period) ?? reports[0],
    [reports, period]
  );

  if (isLoading && !child) {
    return (
      <div className="blog-content" role="status">
        <p>Carregando...</p>
      </div>
    );
  }

  if (error && !child) {
    return (
      <div className="blog-content">
        <h2 className="blog-title">Filho</h2>
        <p>Não foi possível carregar os dados deste aluno.</p>
        <p>
          <Link href="/children" className="vs-btn">
            Voltar aos filhos
          </Link>
        </p>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="blog-content">
        <h2 className="blog-title">Filho</h2>
        <p>Filho não encontrado na sua conta.</p>
        <p>
          <Link href="/children" className="vs-btn">
            Voltar aos filhos
          </Link>
        </p>
      </div>
    );
  }

  const progress = progressQuery.data;
  const learning = learningQuery.data;
  const isDemo = progress?.status === "demo";
  const streak = resolveStudyStreak(progress);
  const hasAccuracy = hasLearningAccuracy(kpiQuery.data);
  const overviewSummary = composeStudySummary({
    activitiesCompleted: learning?.kpis.activities_completed ?? null,
    accuracyPercent: hasAccuracy
      ? kpiQuery.data?.accuracy.percent ?? null
      : null,
    hasAccuracy,
    streakDays: streak,
  });
  const learningMaterials = learning ? materialsFromLearning(learning) : [];
  const overviewLoading =
    canViewProgress &&
    ((learningQuery.isLoading && !learning) ||
      (progressQuery.isLoading && !progress && !learning));
  const overviewError =
    canViewProgress && learningQuery.error && !learning
      ? learningQuery.error
      : canViewProgress && progressQuery.error && !progress && !learning
        ? progressQuery.error
        : null;

  return (
    <div className="blog-content">
      <div className="portal-page-header">
        <h2 className="blog-title">{child.name}</h2>
        {isDemo ? (
          <span className="portal-chip portal-chip--muted">Demonstração</span>
        ) : null}
      </div>

      <p className="mb-3">
        {[child.gradeLabel, child.classroomName, child.schoolName]
          .filter(Boolean)
          .join(" · ") || "Acompanhe o progresso e as conquistas."}
      </p>

      {canViewProgress ? (
        <p className="mb-4 d-flex flex-wrap gap-2">
          <Link href={`/children/${childRef}/estudos`} className="vs-btn">
            Plano de estudos
          </Link>
          <Link href={`/aluno/supervisao/${childRef}`} className="vs-btn style3">
            Acessar Ambiente do Aluno
          </Link>
        </p>
      ) : null}

      <div
        className="mb-4 d-flex flex-wrap gap-2 portal-child-tabs"
        role="tablist"
        aria-label="Seções do acompanhamento"
      >
        {(
          [
            ["overview", "Visão geral"],
            ["reports", "Relatórios"],
            ["achievements", "Conquistas"],
          ] as const
        ).map(([id, label]) => {
          const isActive = tab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              className={isActive ? "vs-btn" : "vs-btn style3"}
              onClick={() => setTab(id)}
              aria-current={isActive ? "true" : undefined}
              aria-selected={isActive}
            >
              {label}
            </button>
          );
        })}
      </div>

      {!canViewProgress ? (
        <div className="alert alert-warning" role="status">
          Você ainda não tem permissão para ver o progresso deste aluno.
        </div>
      ) : null}

      {overviewLoading ? (
        <p role="status">Carregando progresso...</p>
      ) : null}

      {overviewError ? (
        <p style={{ color: "red" }}>
          {overviewError instanceof BffClientError
            ? (overviewError.detail ?? overviewError.title)
            : getUserFacingApiMessage(overviewError)}
        </p>
      ) : null}

      {canViewProgress && tab === "overview" ? (
        <>
          {progress && (progress.school || progress.classrooms.length) ? (
            <div className="widget mb-4">
              <h3 className="widget_title">Escola e turma</h3>
              {progress.school ? (
                <p className="mb-2">
                  <strong>
                    {progress.school.kind === "family_household"
                      ? "Acompanhamento familiar"
                      : progress.school.name}
                  </strong>
                  {progress.school.city
                    ? ` · ${progress.school.city}${progress.school.state ? `/${progress.school.state}` : ""}`
                    : null}
                  {progress.school.gradeLabel
                    ? ` · ${progress.school.gradeLabel}`
                    : null}
                </p>
              ) : null}
              {progress.classrooms.map((classroom) => (
                <div key={classroom.name} className="mb-2">
                  <strong>{classroom.name}</strong>
                  {classroom.teacher?.name ? (
                    <div>
                      Professor(a): {classroom.teacher.name}
                      {classroom.teacher.specialty
                        ? ` · ${classroom.teacher.specialty}`
                        : null}
                    </div>
                  ) : (
                    <div>Estudo acompanhado em casa</div>
                  )}
                </div>
              ))}
            </div>
          ) : null}

          {learning ? (
            <ProgressOverview
              overallPercent={learning.kpis.overall_percent}
              activitiesCompleted={learning.kpis.activities_completed}
              studyStreakDays={streak}
              timeStudiedMinutes={Math.round(
                learning.kpis.time_studied_seconds / 60
              )}
              accuracyPercent={
                hasAccuracy ? kpiQuery.data?.accuracy.percent ?? null : null
              }
              summary={overviewSummary}
            />
          ) : null}

          <LearningOverview childRef={childRef} enabled={canViewProgress} />

          {learning ? (
            <>
              <ProgressBySubject materials={learningMaterials} />
              <PendingMaterials materials={learningMaterials} />
            </>
          ) : null}

          {progress?.upcomingContent.length ? (
            <div className="widget mb-4">
              <h3 className="widget_title">Próximos conteúdos</h3>
              <ul className="mb-0">
                {progress.upcomingContent.map((item) => (
                  <li key={item.title}>
                    <strong>{item.title}</strong>
                    {item.subject ? ` · ${item.subject}` : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {progress?.notifications.length ? (
            <div className="widget mb-4">
              <h3 className="widget_title">Notificações</h3>
              <ul className="list-unstyled mb-0">
                {progress.notifications.map((item) => (
                  <li key={`${item.title}-${item.createdAt}`} className="mb-2">
                    <strong>{item.title}</strong>
                    <div>{item.body}</div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </>
      ) : null}

      {canViewProgress && tab === "reports" ? (
        <div>
          {progressQuery.isLoading && !progress ? (
            <p role="status">Carregando relatórios...</p>
          ) : null}
          {progressQuery.error && !progress ? (
            <p style={{ color: "red" }}>
              {progressQuery.error instanceof BffClientError
                ? (progressQuery.error.detail ?? progressQuery.error.title)
                : getUserFacingApiMessage(progressQuery.error)}
            </p>
          ) : null}
          {progress && !reports.length ? (
            <div className="alert alert-info" role="status">
              Ainda não há relatórios pedagógicos para este período.
            </div>
          ) : null}
          {reports.length ? (
            <>
              <div className="widget widget_categories mb-4">
                <h3 className="widget_title">Períodos</h3>
                <ul>
                  {reports.map((report) => (
                    <li
                      key={report.period}
                      className={
                        report.period === selectedReport?.period
                          ? "current-menu-item"
                          : undefined
                      }
                    >
                      <a
                        href={`#relatorio-${report.period}`}
                        onClick={(event) => {
                          event.preventDefault();
                          setPeriod(report.period);
                        }}
                      >
                        {report.periodLabel}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedReport ? (
                <div className="widget mb-4">
                  <div className="portal-block-heading">
                    <h3 className="portal-block-heading__title">
                      {selectedReport.subject ?? "Relatório"} —{" "}
                      {selectedReport.periodLabel}
                    </h3>
                    <PerformanceBadge level={selectedReport.performanceLevel} />
                  </div>
                  {selectedReport.teacherName ? (
                    <p>Professor(a): {selectedReport.teacherName}</p>
                  ) : null}
                  <p>{selectedReport.summary}</p>
                  {selectedReport.skillsDeveloped.length ? (
                    <>
                      <h4>Habilidades desenvolvidas</h4>
                      <ul>
                        {selectedReport.skillsDeveloped.map((skill) => (
                          <li key={skill}>{skill}</li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                  {selectedReport.skillsInDevelopment.length ? (
                    <>
                      <h4>Em desenvolvimento</h4>
                      <ul>
                        {selectedReport.skillsInDevelopment.map((skill) => (
                          <li key={skill}>{skill}</li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                  {selectedReport.recommendations.length ? (
                    <>
                      <h4>Recomendações</h4>
                      <ul>
                        {selectedReport.recommendations.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      ) : null}

      {canViewProgress && tab === "achievements" ? (
        progressQuery.isLoading && !progress ? (
          <p role="status">Carregando conquistas...</p>
        ) : progressQuery.error && !progress ? (
          <p style={{ color: "red" }}>
            {progressQuery.error instanceof BffClientError
              ? (progressQuery.error.detail ?? progressQuery.error.title)
              : getUserFacingApiMessage(progressQuery.error)}
          </p>
        ) : (
          <GamificationPanel gamification={progress?.gamification ?? null} />
        )
      ) : null}

      <p className="mt-3">
        <Link href="/children" className="vs-btn">
          Voltar aos filhos
        </Link>
      </p>
    </div>
  );
}
