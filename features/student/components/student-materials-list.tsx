"use client";

import Link from "next/link";

import { useStudentFrequencyQuery } from "@/features/student/hooks/use-student-frequency";
import { useStudentMaterialsQuery } from "@/features/student/hooks/use-student-materials";
import { getUserFacingApiMessage } from "@/lib/api/errors";
import { BffClientError } from "@/services/bff/client";
import type { StudentMaterial } from "@/types/student-learning";

type StudentMaterialsListProps = {
  materials?: StudentMaterial[];
  isLoading?: boolean;
  error?: unknown;
  readOnly?: boolean;
  childRef?: string;
};

export function studentMaterialsErrorMessage(error: unknown): string {
  if (error instanceof BffClientError) {
    const subjectMessage = error.errors?.subject_uuid?.trim();
    if (subjectMessage) return subjectMessage;
    return error.detail ?? error.title;
  }

  return getUserFacingApiMessage(error);
}

export function StudentMaterialsList({
  materials: materialsProp,
  isLoading = false,
  error: errorProp = null,
  readOnly = false,
  childRef,
}: StudentMaterialsListProps) {
  const external = materialsProp !== undefined;
  const ownQuery = useStudentMaterialsQuery(!external && !readOnly);
  const frequencyQuery = useStudentFrequencyQuery(!readOnly && !external);
  const materials = materialsProp ?? ownQuery.data ?? [];
  const loading = external ? isLoading : !readOnly && ownQuery.isLoading;
  const error = external ? errorProp : !readOnly ? ownQuery.error : null;
  const base = readOnly && childRef ? `/aluno/supervisao/${childRef}/materiais` : "/aluno/materiais";
  const frequency = frequencyQuery.data;

  if (loading) {
    return <p role="status">Carregando conteúdos...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{studentMaterialsErrorMessage(error)}</p>;
  }

  if (!materials.length) {
    return (
      <div className="alert alert-info" role="status">
        Nenhum material encontrado.
      </div>
    );
  }

  return (
    <>
      {!external && !readOnly && frequency ? (
        <p className="mb-3">
          {frequency.available_count === 0
            ? "Não há aulas disponíveis na sua matrícula."
            : `${frequency.viewed_count} de ${frequency.available_count} aulas vistas · ${frequency.pending_count} pendentes`}
        </p>
      ) : null}
      <div className="row">
      {materials.map((material) => {
        const percent = material.progress.percent_complete ?? 0;
        return (
          <div key={material.content.uuid} className="col-md-6 mb-4">
            <div className="widget portal-child-card h-100">
              <h3 className="widget_title">
                <Link href={`${base}/${material.content.uuid}`}>
                  {material.content.name}
                </Link>
              </h3>
              <p>{material.package.name}</p>
              {material.content.subject ? <p>{material.content.subject.name}</p> : null}
              {material.school ? <p>{material.school.name}</p> : null}
              {material.classroom ? <p>{material.classroom.name}</p> : null}
              <div className="progress mb-2" aria-label="Progresso">
                <div className="progress-bar" style={{ width: `${percent}%` }} />
              </div>
              <p className="small mb-3">{percent}% concluído</p>
              <Link href={`${base}/${material.content.uuid}`} className="vs-btn">
                {readOnly ? "Visualizar" : percent > 0 ? "Continuar" : "Estudar"}
              </Link>
            </div>
          </div>
        );
      })}
      </div>
    </>
  );
}
