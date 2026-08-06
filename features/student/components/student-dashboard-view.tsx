"use client";

import Link from "next/link";

import { useStudentDashboardQuery } from "@/features/student/hooks/use-student-dashboard";
import { useStudentSession } from "@/features/student/hooks/use-student-session";
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
};

function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours}h ${rest}min`;
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

export function StudentDashboardView({
  dashboard,
  isLoading,
  error,
  readOnly = false,
  childRef,
  studentName,
}: StudentDashboardViewProps) {
  const { session } = useStudentSession();
  const ownQuery = useStudentDashboardQuery(!readOnly && !dashboard);
  const data = dashboard ?? ownQuery.data;
  const loading = isLoading ?? ownQuery.isLoading;
  const fetchError = error ?? ownQuery.error;

  const displayName = studentName ?? session?.student.name ?? session?.user.name ?? "Aluno";
  const materialsBase = readOnly && childRef ? `/aluno/supervisao/${childRef}/materiais` : "/aluno/materiais";

  if (loading && !data) {
    return (
      <div className="blog-content" role="status">
        <p>Carregando...</p>
      </div>
    );
  }

  if (fetchError && !data) {
    return (
      <div className="blog-content">
        <p style={{ color: "red" }}>
          {fetchError instanceof BffClientError
            ? (fetchError.detail ?? fetchError.title)
            : getUserFacingApiMessage(fetchError)}
        </p>
      </div>
    );
  }

  if (!data) return null;

  const contextLine = [
    data.school?.name,
    data.classroom?.name,
    session?.grade_label,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="blog-content">
      {readOnly ? (
        <div className="alert alert-info mb-4" role="status">
          <strong>Modo acompanhamento</strong>
          <p className="mb-0">
            Você está visualizando o ambiente de <strong>{displayName}</strong> em
            modo somente leitura. Não é possível responder atividades nem alterar o
            progresso.
          </p>
        </div>
      ) : null}

      <div className="portal-page-header">
        <h2 className="blog-title">Olá, {displayName}</h2>
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
            <strong style={{ fontSize: "1.5rem" }}>{data.kpis.materials_available}</strong>
            <div>Materiais</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="widget text-center h-100">
            <strong style={{ fontSize: "1.5rem" }}>{data.kpis.materials_completed}</strong>
            <div>Concluídos</div>
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

      {data.next_activity ? (
        <div className="widget mb-4">
          <h3 className="widget_title">Próxima atividade</h3>
          <p className="mb-2">{data.next_activity.content.name}</p>
          {!readOnly ? (
            <Link
              href={`${materialsBase}/${data.next_activity.content.uuid}`}
              className="vs-btn"
            >
              Ir para a atividade
            </Link>
          ) : (
            <Link
              href={`${materialsBase}/${data.next_activity.content.uuid}`}
              className="vs-btn style3"
            >
              Ver atividade
            </Link>
          )}
        </div>
      ) : null}

      {data.continue_studying ? (
        <div className="widget mb-4">
          <h3 className="widget_title">Continuar estudando</h3>
          <p className="mb-2">{data.continue_studying.content.name}</p>
          <Link
            href={`${materialsBase}/${data.continue_studying.content.uuid}`}
            className="vs-btn"
          >
            {readOnly ? "Visualizar" : "Continuar"}
          </Link>
        </div>
      ) : null}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Seus materiais</h3>
        <Link href={materialsBase} className="vs-btn style3">
          Ver todos
        </Link>
      </div>

      <div className="row">
        {data.materials.map((material) => (
          <div key={material.content.uuid} className="col-md-6 mb-4">
            <MaterialCard
              material={material}
              href={`${materialsBase}/${material.content.uuid}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
