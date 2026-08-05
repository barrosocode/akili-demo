import type { Metadata } from "next";

import { ChildDetail } from "@/features/children/components/child-detail";

type ChildDetailPageProps = {
  params: Promise<{ ref: string }>;
};

export const metadata: Metadata = {
  title: "Relatórios",
  robots: { index: false, follow: false },
};

/**
 * Detalhe do filho — progresso, relatórios e conquistas (API demo).
 */
export default async function ChildDetailPage({ params }: ChildDetailPageProps) {
  const { ref } = await params;

  return <ChildDetail childRef={ref} />;
}
