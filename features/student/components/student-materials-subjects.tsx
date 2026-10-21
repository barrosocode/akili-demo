"use client";

import { SubjectList } from "@/features/subjects/components/subject-list";
import { resolveStudentSubjects } from "@/features/subjects/lib/resolve-student-subjects";
import { studentMaterialsErrorMessage } from "@/features/student/components/student-materials-list";
import { useStudentMaterialsQuery } from "@/features/student/hooks/use-student-materials";
import { useStudentSubjectsQuery } from "@/features/student/hooks/use-student-subjects";

export function StudentMaterialsSubjects() {
  const materialsQuery = useStudentMaterialsQuery(true);
  const subjectsQuery = useStudentSubjectsQuery();

  if (materialsQuery.isLoading || subjectsQuery.isLoading) {
    return <p role="status">Carregando conteúdos...</p>;
  }

  const error = materialsQuery.error ?? subjectsQuery.error;
  if (error) {
    return <p style={{ color: "red" }}>{studentMaterialsErrorMessage(error)}</p>;
  }

  const subjects = resolveStudentSubjects(
    materialsQuery.data ?? [],
    subjectsQuery.data ?? []
  );

  return (
    <SubjectList
      subjects={subjects}
      hrefFor={(subject) => `/aluno/materiais/disciplina/${subject.uuid}`}
    />
  );
}
