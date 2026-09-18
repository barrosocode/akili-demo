import type { Metadata } from "next";

import { GuardianStudyPlannerView } from "@/features/study-planner/components/guardian-study-planner-view";

type ChildStudiesPageProps = {
  params: Promise<{ ref: string }>;
};

export const metadata: Metadata = {
  title: "Plano de estudos",
  robots: { index: false, follow: false },
};

export default async function ChildStudiesPage({ params }: ChildStudiesPageProps) {
  const { ref } = await params;
  return <GuardianStudyPlannerView childRef={ref} />;
}
