import { StudentSubjectMaterials } from "@/features/student/components/student-subject-materials";

type StudentSubjectMaterialsPageProps = {
  params: Promise<{ subjectUuid: string }>;
};

export default async function StudentSubjectMaterialsPage({
  params,
}: StudentSubjectMaterialsPageProps) {
  const { subjectUuid } = await params;

  return <StudentSubjectMaterials subjectUuid={subjectUuid} />;
}
