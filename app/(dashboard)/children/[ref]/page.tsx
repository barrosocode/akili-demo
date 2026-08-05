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
 * Detalhe do filho → relatórios mockados (PORTAL-008 / layout_old relatoriosView).
 */
export default async function ChildDetailPage({ params }: ChildDetailPageProps) {
  const { ref } = await params;

  return <ChildDetail childRef={ref} />;
}
