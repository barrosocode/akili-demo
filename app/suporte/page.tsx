import type { Metadata } from "next";

import { SupportDeskSearch } from "@/features/support-desk/components/SupportDeskSearch";

export const metadata: Metadata = {
  title: "Mesa de atendimento",
  robots: { index: false, follow: false },
};

export default function SupportDeskPage() {
  return <SupportDeskSearch />;
}
