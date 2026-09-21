import type { Metadata } from "next";
import { Suspense } from "react";

import { SignInForm } from "@/features/auth";
import { isDevLoginPanelEnabled } from "@/lib/auth/dev-login-profiles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  const showDevQuickAccess = isDevLoginPanelEnabled();

  return (
    <Suspense
      fallback={
        <div className="container space-top" role="status">
          <p>Carregando...</p>
        </div>
      }
    >
      <SignInForm showDevQuickAccess={showDevQuickAccess} />
    </Suspense>
  );
}
