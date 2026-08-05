import type { Metadata } from "next";
import { Suspense } from "react";

import { SignInForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="container space-top" role="status">
          <p>Carregando...</p>
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
