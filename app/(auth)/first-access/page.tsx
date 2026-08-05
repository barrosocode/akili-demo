import type { Metadata } from "next";
import { Suspense } from "react";

import { FirstAccessForm } from "@/features/auth/components/first-access-form";

export const metadata: Metadata = {
  title: "Primeiro acesso",
  robots: { index: false, follow: false },
};

export default function FirstAccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container space-top" role="status">
          <p>Carregando...</p>
        </div>
      }
    >
      <FirstAccessForm />
    </Suspense>
  );
}
