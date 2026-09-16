import type { Metadata } from "next";
import { Suspense } from "react";

import { SupportSignInForm } from "@/features/support-desk/components/SupportSignInForm";

export const metadata: Metadata = {
  title: "Atendimento — Entrar",
  robots: { index: false, follow: false },
};

export default function SupportSignInPage() {
  return (
    <Suspense
      fallback={
        <div className="container space-top" role="status">
          <p>Carregando...</p>
        </div>
      }
    >
      <SupportSignInForm />
    </Suspense>
  );
}
