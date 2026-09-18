import type { Metadata } from "next";

import { SupportDeskUserDetail } from "@/features/support-desk/components/SupportDeskUserDetail";

export const metadata: Metadata = {
  title: "Usuário — Atendimento",
  robots: { index: false, follow: false },
};

type PageProps = {
  params: Promise<{ uuid: string }>;
};

export default async function SupportDeskUserPage({ params }: PageProps) {
  const { uuid } = await params;
  return <SupportDeskUserDetail userUuid={uuid} />;
}
