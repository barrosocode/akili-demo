import { SupervisionDashboardPage } from "@/features/student/components/supervision-dashboard-page";

type PageProps = {
  params: Promise<{ childRef: string }>;
};

export default async function GuardianSupervisionPage({ params }: PageProps) {
  const { childRef } = await params;
  return <SupervisionDashboardPage childRef={childRef} />;
}
