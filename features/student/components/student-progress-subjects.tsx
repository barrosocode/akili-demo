"use client";

import { useStudentDashboardQuery } from "@/features/student/hooks/use-student-dashboard";
import {
  SubjectProgressList,
  SubjectProgressNotice,
} from "@/features/subjects/components/subject-progress-list";
import { studentProgressSubjectPath } from "@/lib/auth/portal-paths";

export function StudentProgressSubjects() {
  const query = useStudentDashboardQuery();
  const ready = query.data !== undefined;

  return (
    <div className="blog-content">
      <div className="portal-page-header">
        <h2 className="blog-title">Meu progresso</h2>
      </div>

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
          hrefFor={(item) => studentProgressSubjectPath(item.subject.uuid)}
        />
      ) : null}
    </div>
  );
}
