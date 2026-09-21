import { Suspense } from "react";

import { StudentLoginForm } from "@/features/student/components/student-login-form";
import { isDevLoginPanelEnabled } from "@/lib/auth/dev-login-profiles";

export const dynamic = "force-dynamic";

export default function StudentLoginPage() {
  const showDevQuickAccess = isDevLoginPanelEnabled();

  return (
    <div className="blog-content">
      <Suspense fallback={<p>Carregando...</p>}>
        <StudentLoginForm showDevQuickAccess={showDevQuickAccess} />
      </Suspense>
    </div>
  );
}
