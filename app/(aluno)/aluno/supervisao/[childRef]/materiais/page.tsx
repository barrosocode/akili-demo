import { SupervisionMaterialsPage } from "@/features/student/components/supervision-materials-page";

type PageProps = {
  params: Promise<{ childRef: string }>;
};

export default async function GuardianSupervisionMaterialsPage({ params }: PageProps) {
  const { childRef } = await params;
  return <SupervisionMaterialsPage childRef={childRef} />;
}
