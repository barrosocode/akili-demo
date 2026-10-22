import { SupervisionProgressSubjects } from "@/features/student/components/supervision-progress-subjects";

type PageProps = {
  params: Promise<{ childRef: string }>;
};

export default async function GuardianSupervisionPage({ params }: PageProps) {
  const { childRef } = await params;
  return <SupervisionProgressSubjects childRef={childRef} />;
}
