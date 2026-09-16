import { Suspense } from "react";
import type { Metadata } from "next";

import { AssistanceAdoptClient } from "@/features/assistance/components/AssistanceAdoptClient";

export const metadata: Metadata = {
  title: "Atendimento",
  robots: { index: false, follow: false },
};

export default function AssistanceAdoptPage() {
  return (
    <Suspense
      fallback={
        <div className="container space-top" role="status">
          <p>Abrindo o portal em modo atendimento…</p>
        </div>
      }
    >
      <AssistanceAdoptClient />
    </Suspense>
  );
}
