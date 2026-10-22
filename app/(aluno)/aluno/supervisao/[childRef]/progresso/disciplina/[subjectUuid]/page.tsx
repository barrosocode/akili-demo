import { StudentDashboardView } from "@/features/student/components/student-dashboard-view";

type SupervisionProgressSubjectPageProps = {
  params: Promise<{ childRef: string; subjectUuid: string }>;
};

export default async function SupervisionProgressSubjectPage({
  params,
}: SupervisionProgressSubjectPageProps) {
  const { childRef, subjectUuid } = await params;

  return (
    <StudentDashboardView readOnly childRef={childRef} subjectUuid={subjectUuid} />
  );
}
