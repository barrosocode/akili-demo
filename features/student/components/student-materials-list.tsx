"use client";

import Link from "next/link";

import { useStudentMaterialsQuery } from "@/features/student/hooks/use-student-materials";
import { getUserFacingApiMessage } from "@/lib/api/errors";
import { BffClientError } from "@/services/bff/client";
import type { StudentMaterial } from "@/types/student-learning";

type StudentMaterialsListProps = {
  materials?: StudentMaterial[];
  readOnly?: boolean;
  childRef?: string;
};

export function StudentMaterialsList({
  materials: materialsProp,
  readOnly = false,
  childRef,
}: StudentMaterialsListProps) {
  const ownQuery = useStudentMaterialsQuery(!materialsProp && !readOnly);
  const materials = materialsProp ?? ownQuery.data ?? [];
  const loading = !materialsProp && !readOnly && ownQuery.isLoading;
  const error = !materialsProp && !readOnly ? ownQuery.error : null;
  const base = readOnly && childRef ? `/aluno/supervisao/${childRef}/materiais` : "/aluno/materiais";

  if (loading) {
    return <p role="status">Carregando materiais...</p>;
  }

  if (error) {
    return (
      <p style={{ color: "red" }}>
        {error instanceof BffClientError
          ? (error.detail ?? error.title)
          : getUserFacingApiMessage(error)}
      </p>
    );
  }

  if (!materials.length) {
    return (
      <div className="alert alert-info" role="status">
        Nenhum material liberado para este aluno no momento.
      </div>
    );
  }

  return (
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
  );
}
