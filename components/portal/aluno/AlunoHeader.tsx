"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { siteConfig } from "@/constants/site";
import { useStudentSession } from "@/features/student/hooks/use-student-session";
import {
  GUARDIAN_HOME_PATH,
  GUARDIAN_LOGIN_PATH,
  isSupervisionPath,
  STUDENT_HOME_PATH,
  STUDENT_LOGIN_PATH,
} from "@/lib/auth/portal-paths";
import { useSession } from "@/providers/session-provider";
import { bffClient } from "@/services/bff/client";
import { useLogoutMutation } from "@/services/queries/auth.mutations";

type AlunoHeaderProps = {
  homeHref?: string;
};

/**
 * Header clean do aluno (PORTAL-012).
 * Mantém `header-top4` para o offset negativo do `.header-lower4` do Kiddino.
 */
export function AlunoHeader({ homeHref }: AlunoHeaderProps) {
  const pathname = usePathname() ?? "";
  const isSupervision = isSupervisionPath(pathname);
  const isLoginPath = pathname.startsWith(STUDENT_LOGIN_PATH);

  const { session: studentSession } = useStudentSession();
  const { user: guardianUser } = useSession();
  const guardianLogout = useLogoutMutation();
  const queryClient = useQueryClient();
  const router = useRouter();

  const studentLogout = useMutation({
    mutationFn: () =>
      bffClient<{ ok: true }>("/api/student/auth/logout", { method: "POST" }),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["student", "session"] });
      queryClient.clear();
    },
  });

  const displayName = isSupervision
    ? (guardianUser?.name ?? "Responsável")
    : (studentSession?.user.name ?? studentSession?.student.name ?? "Aluno");

  const resolvedHomeHref =
    homeHref ?? (isSupervision ? GUARDIAN_HOME_PATH : STUDENT_HOME_PATH);
  const greeting = isSupervision ? "Acompanhando como" : "Olá,";
  const canLogout = isSupervision
    ? Boolean(guardianUser)
    : Boolean(studentSession) && !isLoginPath;
  const isLoggingOut = isSupervision
    ? guardianLogout.isPending
    : studentLogout.isPending;

  async function handleLogout() {
    try {
      if (isSupervision) {
        await guardianLogout.mutateAsync();
      } else {
        await studentLogout.mutateAsync();
      }
    } catch {
      // Redireciona mesmo se a API falhar.
    }
    router.push(isSupervision ? GUARDIAN_LOGIN_PATH : STUDENT_LOGIN_PATH);
    router.refresh();
  }

  return (
    <header className="vs-header header-layout4">
      <div className="header-top4" />
      <div className="sticky-wrap">
        <div className="sticky-active">
          <div className="container-style4">
            <div className="header-lower4">
              <div className="row gx-3 align-items-center justify-content-between">
                <div className="col-8 col-sm-auto">
                  <div className="header-logo2">
                    <Link href={resolvedHomeHref}>
                      <Image
                        src={siteConfig.assets.logoPositive.src}
                        alt={siteConfig.brand.name}
                        width={siteConfig.assets.logoPositive.width}
                        height={siteConfig.assets.logoPositive.height}
                        priority
                      />
                    </Link>
                  </div>
                </div>
                <div className="col">
                  <span style={{ fontSize: 15 }}>
                    {greeting} <strong>{displayName}</strong>
                  </span>
                </div>
                {canLogout ? (
                  <div className="col-auto">
                    <button
                      type="button"
                      className="simple-icon cart"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        void handleLogout();
                      }}
                      disabled={isLoggingOut}
                    >
                      <i className="fas fa-sign-out-alt" aria-hidden /> Sair
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
