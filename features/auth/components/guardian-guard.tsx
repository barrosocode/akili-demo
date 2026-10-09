"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useSession } from "@/providers/session-provider";
import { checkAccess } from "@/lib/permissions/can";
import { getRoutePermission } from "@/lib/permissions/route-permissions";
import { isAssistanceReadOnly } from "@/lib/permissions/guardian-capabilities";

/**
 * Garante sessão autenticada com permissão da rota.
 * Interrompe o fluxo quando há termos obrigatórios pendentes
 * (exceto em assistência ativa — aceite é bloqueado no backend —
 * e em /children/new, onde o aceite entra no cadastro do filho).
 */
export function GuardianGuard({ children }: { children: ReactNode }) {
  const { user, isLoading } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const normalizedPath = pathname.replace(/\/$/, "") || "/";
  const isTermsPath =
    normalizedPath === "/terms" || normalizedPath.startsWith("/terms/");
  const isChildRegistrationPath = normalizedPath === "/children/new";
  const assistanceActive = isAssistanceReadOnly(user);

  const permission = getRoutePermission(pathname);
  const hasAccess = Boolean(
    user && checkAccess(user.permissions, permission)
  );
  const termsPending = Boolean(
    user && !user.terms.allAccepted && !assistanceActive
  );
  const termsBlocked = termsPending && !isTermsPath && !isChildRegistrationPath;

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/signin");
      return;
    }

    if (termsBlocked) {
      router.replace("/terms");
      return;
    }

    if (!termsPending && isTermsPath && !assistanceActive) {
      router.replace("/");
      return;
    }

    if (!hasAccess && !isTermsPath) {
      router.replace("/signin?error=access-denied");
    }
  }, [
    user,
    isLoading,
    router,
    hasAccess,
    termsPending,
    termsBlocked,
    isTermsPath,
    assistanceActive,
  ]);

  if (isLoading || !user) {
    return (
      <div className="container space-top" role="status">
        <p>Carregando...</p>
      </div>
    );
  }

  if (termsBlocked) {
    return (
      <div className="container space-top" role="status">
        <p>Redirecionando para o aceite dos termos...</p>
      </div>
    );
  }

  if (!hasAccess && !isTermsPath) {
    return (
      <div className="container space-top" role="status">
        <p>Carregando...</p>
      </div>
    );
  }

  return <>{children}</>;
}
