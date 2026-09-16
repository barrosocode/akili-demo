import type { Metadata } from "next";

import { AssistanceEnterClient } from "@/features/assistance/components/AssistanceEnterClient";

export const metadata: Metadata = {
  title: "Atendimento",
  robots: { index: false, follow: false },
};

export default function AssistanceEnterPage() {
  return <AssistanceEnterClient />;
}
