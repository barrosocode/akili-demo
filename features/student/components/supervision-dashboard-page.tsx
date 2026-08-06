"use client";

import Link from "next/link";

import { StudentDashboardView } from "@/features/student/components/student-dashboard-view";
import { useGuardianSupervisionDashboardQuery } from "@/features/student/hooks/use-student-dashboard";

type SupervisionDashboardPageProps = {
  childRef: string;
};

export function SupervisionDashboardPage({ childRef }: SupervisionDashboardPageProps) {
  const { data, isLoading, error } = useGuardianSupervisionDashboardQuery(childRef);

  return (
    <>
      <p className="mb-3">
        <Link href="/children" className="vs-btn style3">
          Voltar aos filhos
        </Link>
      </p>
      <StudentDashboardView
        dashboard={data}
        isLoading={isLoading}
        error={error}
        readOnly
        childRef={childRef}
        studentName={data?.student?.name}
      />
    </>
  );
}
