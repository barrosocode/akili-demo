"use client";

import Link from "next/link";

import { useGuardianSupervisionDashboardQuery } from "@/features/student/hooks/use-student-dashboard";
import {
  SubjectProgressList,
  SubjectProgressNotice,
} from "@/features/subjects/components/subject-progress-list";
import { supervisionProgressSubjectPath } from "@/lib/auth/portal-paths";

type SupervisionProgressSubjectsProps = {
  childRef: string;
};

export function SupervisionProgressSubjects({
  childRef,
}: SupervisionProgressSubjectsProps) {
  const query = useGuardianSupervisionDashboardQuery(childRef);
  const ready = query.data !== undefined;
  const studentName = query.data?.student?.name?.trim();

  return (
    <div className="blog-content">
      <p className="mb-3">
        <Link href="/children" className="vs-btn style3">
          Voltar aos filhos
        </Link>
      </p>
      <div className="portal-page-header">
        <h2 className="blog-title">Meu progresso</h2>
      </div>
      {studentName ? <p className="mb-4">{studentName}</p> : null}

      {query.isLoading && !ready ? (
        <SubjectProgressNotice title="" message="Carregando seu progresso..." />
      ) : null}

      {query.isError && !ready ? (
        <SubjectProgressNotice
          title=""
          tone="alert"
          message="Não foi possível carregar o progresso."
        />
      ) : null}

      {ready ? (
        <SubjectProgressList
          items={query.data?.subject_progress}
          mode="full"
          title=""
          hrefFor={(item) => supervisionProgressSubjectPath(childRef, item.subject.uuid)}
        />
      ) : null}
    </div>
  );
}
