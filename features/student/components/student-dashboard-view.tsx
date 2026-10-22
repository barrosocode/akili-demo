"use client";

import Link from "next/link";

import { LearningOverview } from "@/features/progress";
import { studentMaterialsErrorMessage } from "@/features/student/components/student-materials-list";
import {
  useGuardianSupervisionDashboardQuery,
  useStudentDashboardQuery,
} from "@/features/student/hooks/use-student-dashboard";
import { useStudentFrequencyQuery } from "@/features/student/hooks/use-student-frequency";
import { useStudentSession } from "@/features/student/hooks/use-student-session";
import { STUDENT_PROGRESS_PATH, supervisionHomePath } from "@/lib/auth/portal-paths";
import { getUserFacingApiMessage } from "@/lib/api/errors";
import { BffClientError } from "@/services/bff/client";
import type { StudentDashboard, StudentMaterial } from "@/types/student-learning";

type StudentDashboardViewProps = {
  dashboard?: StudentDashboard | null;
  isLoading?: boolean;
  error?: unknown;
  readOnly?: boolean;
  childRef?: string;
  studentName?: string;
  title?: string;
  subjectUuid?: string;
};

function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours}h ${rest}min`;
}

function subjectHeading(data: StudentDashboard, subjectUuid: string): string {
  const match = data.subject_progress?.find((item) => item.subject.uuid === subjectUuid);
  const name = match?.subject.name?.trim();
  return name || "Disciplina";
}

function subjectUuidMessage(error: unknown): string | null {
  if (!(error instanceof BffClientError)) return null;
  const message = error.errors?.subject_uuid?.trim();
  return message || null;
}

function MaterialCard({
  material,
  href,
}: {
  material: StudentMaterial;
  href: string;
}) {
  const percent = material.progress.percent_complete ?? 0;

  return (
    <div className="widget portal-child-card h-100">
      <h3 className="widget_title">
        <Link href={href}>{material.content.name}</Link>
      </h3>
      {material.content.subject ? <p>{material.content.subject.name}</p> : null}
      {material.teacher?.name ? <p>Professor(a): {material.teacher.name}</p> : null}
      <div className="d-flex justify-content-between small mb-1">
        <span>Progresso</span>
        <strong>{percent}%</strong>
      </div>
      <div className="progress mb-3" aria-label="Progresso do material">
        <div className="progress-bar" style={{ width: `${percent}%` }} />
      </div>
      <Link href={href} className="vs-btn">
        {percent > 0 ? "Continuar" : "Começar"}
      </Link>
    </div>
  );
}

function BackLink({ href }: { href: string }) {
  return (
    <p className="mb-3">
      <Link href={href} className="vs-btn style3">
        Voltar
      </Link>
    </p>
  );
}

function SupervisionNotice({ name }: { name: string }) {
  return (
    <div className="alert alert-info mb-4" role="status">
      <strong>Modo acompanhamento</strong>
      <p className="mb-0">
        Você está visualizando o ambiente de <strong>{name}</strong> em modo somente
        leitura. Não é possível responder atividades nem alterar o progresso.
      </p>
    </div>
  );
}

export function StudentDashboardView({
  dashboard,
  isLoading,
  error,
  readOnly = false,
  childRef,
  studentName,
  title,
  subjectUuid,
}: StudentDashboardViewProps) {
  const { session } = useStudentSession({ enabled: !readOnly });
  const ownQuery = useStudentDashboardQuery(dashboard === undefined && !readOnly, subjectUuid);
  const guardianQuery = useGuardianSupervisionDashboardQuery(
    childRef ?? "",
    dashboard === undefined && readOnly && Boolean(childRef),
    subjectUuid
  );
  const activeQuery = readOnly ? guardianQuery : ownQuery;
  const frequencyQuery = useStudentFrequencyQuery(!readOnly, subjectUuid);
  const data = dashboard ?? activeQuery.data;
  const loading = isLoading ?? activeQuery.isLoading;
  const fetchError = error ?? activeQuery.error;
  const frequency = frequencyQuery.data;

  const displayName =
    studentName ??
    data?.student?.name ??
    session?.student.name ??
    session?.user.name ??
    "Aluno";
  const studyBase =
    readOnly && childRef ? `/aluno/supervisao/${childRef}/materiais` : "/aluno/materiais";
  const materialsHref =
    subjectUuid && !readOnly ? `/aluno/materiais/disciplina/${subjectUuid}` : studyBase;
  const backHref =
    readOnly && childRef ? supervisionHomePath(childRef) : STUDENT_PROGRESS_PATH;
  const scopeError = subjectUuidMessage(fetchError);

  if (loading && !data) {
    return (
      <div className="blog-content">
        {subjectUuid ? <BackLink href={backHref} /> : null}
        <div className="portal-page-header">
          <h2 className="blog-title" role="status">
            Carregando...
          </h2>
        </div>
      </div>
    );
  }

  if (scopeError && !data) {
    return (
      <div className="blog-content">
        <BackLink href={backHref} />
        <p role="alert" style={{ color: "red" }}>
          {studentMaterialsErrorMessage(fetchError)}
        </p>
      </div>
    );
  }

  if (fetchError && !data) {
    return (
      <div className="blog-content">
        {subjectUuid ? <BackLink href={backHref} /> : null}
        <p style={{ color: "red" }}>
          {fetchError instanceof BffClientError
            ? (fetchError.detail ?? fetchError.title)
            : getUserFacingApiMessage(fetchError)}
        </p>
      </div>
    );
  }

  if (!data) return null;

  const heading = subjectUuid ? subjectHeading(data, subjectUuid) : (title ?? `Olá, ${displayName}`);
  const contextLine = [data.school?.name, data.classroom?.name, readOnly ? null : session?.grade_label]
    .filter(Boolean)
    .join(" · ");
  const materials =
    readOnly && subjectUuid
      ? data.materials.filter((material) => material.content.subject?.uuid === subjectUuid)
      : data.materials;

  return (
    <div className="blog-content">
      {subjectUuid ? <BackLink href={backHref} /> : null}
      {readOnly ? <SupervisionNotice name={displayName} /> : null}

      <div className="portal-page-header">
        <h2 className="blog-title">{heading}</h2>
      </div>
      {contextLine ? <p className="mb-4">{contextLine}</p> : null}

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="widget text-center h-100">
            <strong style={{ fontSize: "1.5rem" }}>{data.kpis.overall_percent}%</strong>
            <div>Progresso geral</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="widget text-center h-100">
            <strong style={{ fontSize: "1.5rem" }}>{data.kpis.activities_completed}</strong>
            <div>Atividades concluídas</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="widget text-center h-100">
            <strong style={{ fontSize: "1.5rem" }}>{data.kpis.materials_completed}</strong>
            <div>Materiais concluídos</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="widget text-center h-100">
            <strong style={{ fontSize: "1.5rem" }}>
              {formatDuration(data.kpis.time_studied_seconds)}
            </strong>
            <div>Tempo estudado</div>
          </div>
        </div>
      </div>

      {!readOnly ? (
        <div className="mb-4">
          <h3 className="mb-3">Frequência das aulas</h3>
          {frequencyQuery.isLoading && !frequency ? (
            <p role="status">Carregando frequência...</p>
          ) : null}
          {frequencyQuery.error && !frequency ? (
            <p style={{ color: "red" }} role="alert">
              {frequencyQuery.error instanceof BffClientError
                ? (frequencyQuery.error.detail ?? frequencyQuery.error.title)
                : getUserFacingApiMessage(frequencyQuery.error)}
            </p>
          ) : null}
          {frequency && frequency.available_count === 0 ? (
            <div className="alert alert-info mb-0" role="status">
              {subjectUuid
                ? "Não há aulas disponíveis nesta disciplina."
                : "Não há aulas disponíveis na sua matrícula."}
            </div>
          ) : null}
          {frequency && frequency.available_count > 0 ? (
            <div className="row g-3">
              <div className="col-6 col-md-3">
                <div className="widget text-center h-100">
                  <strong style={{ fontSize: "1.5rem" }}>{frequency.available_count}</strong>
                  <div>Aulas disponíveis</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="widget text-center h-100">
                  <strong style={{ fontSize: "1.5rem" }}>{frequency.viewed_count}</strong>
                  <div>Já vistas</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="widget text-center h-100">
                  <strong style={{ fontSize: "1.5rem" }}>{frequency.pending_count}</strong>
                  <div>Pendentes</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="widget text-center h-100">
                  <strong style={{ fontSize: "1.5rem" }}>{frequency.viewed_percent}%</strong>
                  <div>% vistas</div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {readOnly && childRef ? (
        <LearningOverview source="guardian" childRef={childRef} subjectUuid={subjectUuid} />
      ) : null}
      {!readOnly ? <LearningOverview source="student" subjectUuid={subjectUuid} /> : null}

      {data.next_activity ? (
        <div className="widget mb-4">
          <h3 className="widget_title">Próxima atividade</h3>
          <p className="mb-2">{data.next_activity.content.name}</p>
          <Link
            href={`${studyBase}/${data.next_activity.content.uuid}`}
            className={readOnly ? "vs-btn style3" : "vs-btn"}
          >
            {readOnly ? "Ver atividade" : "Ir para a atividade"}
          </Link>
        </div>
      ) : null}

      {data.continue_studying ? (
        <div className="widget mb-4">
          <h3 className="widget_title">Continuar estudando</h3>
          <p className="mb-2">{data.continue_studying.content.name}</p>
          <Link href={`${studyBase}/${data.continue_studying.content.uuid}`} className="vs-btn">
            {readOnly ? "Visualizar" : "Continuar"}
          </Link>
        </div>
      ) : null}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Seus materiais</h3>
        <Link href={materialsHref} className="vs-btn style3">
          Ver todos
        </Link>
      </div>

      <div className="row">
        {materials.map((material) => (
          <div key={material.content.uuid} className="col-md-6 mb-4">
            <MaterialCard material={material} href={`${studyBase}/${material.content.uuid}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
