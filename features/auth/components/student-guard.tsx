"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useStudentSession } from "@/features/student/hooks/use-student-session";

/**
 * Garante sessão autenticada de aluno (canal mobile, cookies separados).
 */
export function StudentGuard({ children }: { children: ReactNode }) {
  const { session, isLoading } = useStudentSession();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPath = pathname.startsWith("/aluno/entrar");

  useEffect(() => {
    if (isLoading || isLoginPath) return;
    if (!session) {
      router.replace(`/aluno/entrar?next=${encodeURIComponent(pathname)}`);
    }
  }, [session, isLoading, router, pathname, isLoginPath]);

  if (isLoginPath) return <>{children}</>;

  if (isLoading || !session) {
    return (
      <div role="status" aria-live="polite">
        <p>Carregando...</p>
      </div>
    );
  }

  return <>{children}</>;
}
