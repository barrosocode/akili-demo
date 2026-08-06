import { Suspense } from "react";

import { StudentLoginForm } from "@/features/student/components/student-login-form";

export default function StudentLoginPage() {
  return (
    <div className="blog-content">
      <Suspense fallback={<p>Carregando...</p>}>
        <StudentLoginForm />
      </Suspense>
    </div>
  );
}
