"use client";

import { ArrowRight, CalendarDays, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useId } from "react";

import { StudentWelcomeCard } from "@/features/student/components/student-welcome-card";
import { studentMaterialsErrorMessage } from "@/features/student/components/student-materials-list";
import { useStudentDashboardQuery } from "@/features/student/hooks/use-student-dashboard";
import { useStudentMaterialsQuery } from "@/features/student/hooks/use-student-materials";
import { useStudentSubjectsQuery } from "@/features/student/hooks/use-student-subjects";
import { SubjectList } from "@/features/subjects/components/subject-list";
import {
  SubjectProgressList,
  SubjectProgressNotice,
} from "@/features/subjects/components/subject-progress-list";
import { resolveStudentSubjects } from "@/features/subjects/lib/resolve-student-subjects";
import { getUserFacingApiMessage } from "@/lib/api/errors";
import { BffClientError } from "@/services/bff/client";
import type { StudentMaterial, SubjectProgressItem } from "@/types/student-learning";

const MATERIALS_PATH = "/aluno/materiais";
const PROGRESS_PATH = "/aluno/progresso";

function dashboardErrorMessage(error: unknown): string {
  if (error instanceof BffClientError) {
    return error.detail ?? error.title;
  }
  return getUserFacingApiMessage(error);
}

function activityLabel(material: StudentMaterial): string {
  const subject = material.content.subject?.name?.trim();
  const name = material.content.name.trim();
  if (subject && name) return `${subject} - ${name}`;
  return name || subject || "Atividade";
}

function CoursesSection({
  isLoading,
  error,
  subjects,
}: {
  isLoading: boolean;
  error: unknown;
  subjects: ReturnType<typeof resolveStudentSubjects>;
}) {
  if (isLoading) {
    return (
      <section className="subject-list" aria-busy="true">
        <h2 className="subject-list__title">Meus cursos</h2>
        <p className="subject-list__empty" role="status">
          Carregando seus cursos...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="subject-list">
        <h2 className="subject-list__title">Meus cursos</h2>
        <p className="subject-list__empty" role="alert">
          {studentMaterialsErrorMessage(error)}
        </p>
      </section>
    );
  }

  return (
    <SubjectList
      subjects={subjects}
      title="Meus cursos"
      renderAction={(subject) => (
        <Link
          href={`${MATERIALS_PATH}/disciplina/${subject.uuid}`}
          className="subject-list__continue"
        >
          Continuar
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      )}
    />
  );
}

function ProgressSection({
  isLoading,
  error,
  items,
}: {
  isLoading: boolean;
  error: unknown;
  items: SubjectProgressItem[] | null | undefined;
}) {
  if (isLoading) {
    return <SubjectProgressNotice message="Carregando seu progresso..." />;
  }

  if (error) {
    return (
      <SubjectProgressNotice tone="alert" message={dashboardErrorMessage(error)} />
    );
  }

  return (
    <SubjectProgressList items={items} mode="preview" detailsHref={PROGRESS_PATH} />
  );
}

function UpcomingSection({
  isLoading,
  error,
  activity,
}: {
  isLoading: boolean;
  error: unknown;
  activity: StudentMaterial | null;
}) {
  const titleId = useId();

  return (
    <section className="student-upcoming" aria-labelledby={titleId}>
      <div className="student-upcoming__header">
        <div className="student-upcoming__heading">
          <CalendarDays className="student-upcoming__mark" size={18} aria-hidden="true" />
          <h2 id={titleId} className="student-upcoming__title">
            Próximas atividades
          </h2>
        </div>
        {!isLoading && !error ? (
          <Link href={MATERIALS_PATH} className="student-upcoming__all">
            Ver todos
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        ) : null}
      </div>

      {isLoading ? (
        <p className="student-upcoming__message" role="status">
          Carregando atividades...
        </p>
      ) : null}

      {!isLoading && error ? (
        <p className="student-upcoming__message" role="alert">
          {dashboardErrorMessage(error)}
        </p>
      ) : null}

      {!isLoading && !error && !activity ? (
        <p className="student-upcoming__message">Nenhuma atividade para agora.</p>
      ) : null}

      {!isLoading && !error && activity ? (
        <Link
          href={`${MATERIALS_PATH}/${activity.content.uuid}`}
          className="student-upcoming__item"
        >
          <span className="student-upcoming__badge">Hoje</span>
          <span className="student-upcoming__label">{activityLabel(activity)}</span>
          <ChevronRight className="student-upcoming__chevron" size={18} aria-hidden="true" />
        </Link>
      ) : null}
    </section>
  );
}

export function StudentHomeView() {
  const materialsQuery = useStudentMaterialsQuery(true);
  const subjectsQuery = useStudentSubjectsQuery();
  const dashboardQuery = useStudentDashboardQuery();

  const coursesLoading = materialsQuery.isLoading || subjectsQuery.isLoading;
  const coursesError = materialsQuery.error ?? subjectsQuery.error;
  const subjects =
    coursesLoading || coursesError
      ? []
      : resolveStudentSubjects(materialsQuery.data ?? [], subjectsQuery.data ?? []);

  const dashboardLoading = dashboardQuery.isLoading && !dashboardQuery.data;
  const dashboardError = dashboardQuery.error && !dashboardQuery.data ? dashboardQuery.error : null;

  return (
    <div className="student-home">
      <div className="student-home__primary">
        <StudentWelcomeCard />
        <CoursesSection
          isLoading={coursesLoading}
          error={coursesError}
          subjects={subjects}
        />
      </div>
      <div className="student-home__secondary">
        <ProgressSection
          isLoading={dashboardLoading}
          error={dashboardError}
          items={dashboardQuery.data?.subject_progress}
        />
        <UpcomingSection
          isLoading={dashboardLoading}
          error={dashboardError}
          activity={dashboardQuery.data?.next_activity ?? null}
        />
      </div>
    </div>
  );
}
