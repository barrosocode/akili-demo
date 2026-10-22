"use client";

import Link from "next/link";

import { StudentContentSearch } from "@/features/student/components/student-content-search";
import { StudentMaterialsList } from "@/features/student/components/student-materials-list";
import { useStudentSubjectsQuery } from "@/features/student/hooks/use-student-subjects";

type StudentSubjectMaterialsProps = {
  subjectUuid: string;
};

export function StudentSubjectMaterials({ subjectUuid }: StudentSubjectMaterialsProps) {
  const subjectsQuery = useStudentSubjectsQuery();
  const subject = subjectsQuery.data?.find((item) => item.uuid === subjectUuid);
  const title = subjectsQuery.isLoading
    ? "Carregando conteúdos..."
    : (subject?.name ?? "Conteúdos");

  return (
    <div className="blog-content">
      <p className="mb-3">
        <Link href="/aluno/materiais">Materiais</Link>
      </p>
      <h2 className="blog-title" role={subjectsQuery.isLoading ? "status" : undefined}>
        {title}
      </h2>
      <StudentContentSearch subjectUuid={subjectUuid}>
        {({ materials, isLoading, error }) => (
          <StudentMaterialsList materials={materials} isLoading={isLoading} error={error} />
        )}
      </StudentContentSearch>
    </div>
  );
}
