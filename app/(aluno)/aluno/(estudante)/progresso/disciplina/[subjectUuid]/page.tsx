import { StudentDashboardView } from "@/features/student/components/student-dashboard-view";

type StudentProgressSubjectPageProps = {
  params: Promise<{ subjectUuid: string }>;
};

export default async function StudentProgressSubjectPage({
  params,
}: StudentProgressSubjectPageProps) {
  const { subjectUuid } = await params;

  return <StudentDashboardView subjectUuid={subjectUuid} />;
}
