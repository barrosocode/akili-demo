"use client";

import { Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
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
import type { StudentPortalSession } from "@/types/student-learning";

type AlunoHeaderProps = {
  homeHref?: string;
};

function firstToken(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  const [first] = trimmed.split(/\s+/);
  return first || null;
}

function studentDisplayName(session: StudentPortalSession | null): string {
  if (!session) return "Aluno";
  const preferred = session.student.preferred_name?.trim();
  if (preferred) return preferred;
  return firstToken(session.student.name) ?? firstToken(session.user.name) ?? "Aluno";
}

function initialFrom(name: string): string {
  const first = firstToken(name);
  return first ? first.charAt(0).toUpperCase() : "A";
}

/**
 * Cabeçalho do aluno e da supervisão.
 * A engrenagem abre Sair — não há tela de configurações do aluno.
 */
export function AlunoHeader({ homeHref }: AlunoHeaderProps) {
  const pathname = usePathname() ?? "";
  const isSupervision = isSupervisionPath(pathname);
  const isLoginPath = pathname.startsWith(STUDENT_LOGIN_PATH);
  const menuId = useId();
  const accountRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);

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
    ? (firstToken(guardianUser?.name) ?? "Responsável")
    : studentDisplayName(studentSession);
  const photoUrl = isSupervision
    ? guardianUser?.avatarUrl
    : studentSession?.user.profile_photo_url;
  const resolvedHomeHref =
    homeHref ?? (isSupervision ? GUARDIAN_HOME_PATH : STUDENT_HOME_PATH);
  const canLogout = isSupervision
    ? Boolean(guardianUser)
    : Boolean(studentSession) && !isLoginPath;
  const isLoggingOut = isSupervision
    ? guardianLogout.isPending
    : studentLogout.isPending;
  const showPhoto = Boolean(photoUrl) && !photoFailed;

  useEffect(() => {
    setPhotoFailed(false);
  }, [photoUrl]);

  useEffect(() => {
    if (!menuOpen) return;

    function onPointerDown(event: MouseEvent) {
      if (!accountRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  async function handleLogout() {
    setMenuOpen(false);
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
    <header className="aluno-topbar">
      <div className="aluno-frame aluno-topbar__inner">
        <div className="aluno-topbar__brand">
          <Link href={resolvedHomeHref} className="aluno-topbar__logo">
            <Image
              className="aluno-topbar__logo-img"
              src={siteConfig.assets.logoPositive.src}
              alt={siteConfig.brand.name}
              width={siteConfig.assets.logoPositive.width}
              height={siteConfig.assets.logoPositive.height}
              priority
            />
          </Link>
          <p className="aluno-topbar__tagline">
            Seu potencial{" "}
            <span>é único!</span>
          </p>
        </div>

        <div className="aluno-topbar__account" ref={accountRef}>
          <span className="aluno-topbar__avatar" aria-hidden="true">
            {showPhoto ? (
              <img
                src={photoUrl ?? ""}
                alt=""
                onError={() => {
                  setPhotoFailed(true);
                }}
              />
            ) : (
              initialFrom(displayName)
            )}
          </span>
          <span className="aluno-topbar__name">{displayName}</span>
          {canLogout ? (
            <>
              <button
                type="button"
                className="aluno-topbar__gear"
                aria-label="Abrir menu da conta"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-controls={menuId}
                onClick={() => {
                  setMenuOpen((open) => !open);
                }}
              >
                <Settings size={18} aria-hidden="true" />
              </button>
              {menuOpen ? (
                <div className="aluno-topbar__menu" id={menuId} role="menu">
                  <button
                    type="button"
                    role="menuitem"
                    className="aluno-topbar__logout"
                    onClick={() => {
                      void handleLogout();
                    }}
                    disabled={isLoggingOut}
                  >
                    Sair
                  </button>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
