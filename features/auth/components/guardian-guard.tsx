"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useSession } from "@/providers/session-provider";
import { checkAccess } from "@/lib/permissions/can";
import { getRoutePermission } from "@/lib/permissions/route-permissions";

/**
 * Garante sessão autenticada com permissão da rota.
 * Interrompe o fluxo quando há termos obrigatórios pendentes.
 */
export function GuardianGuard({ children }: { children: ReactNode }) {
  const { user, isLoading } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isTermsPath = pathname === "/terms" || pathname.startsWith("/terms/");

  const permission = getRoutePermission(pathname);
  const hasAccess = Boolean(
    user && checkAccess(user.permissions, permission)
  );
  const termsPending = Boolean(user && !user.terms.allAccepted);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/signin");
      return;
    }

    if (termsPending && !isTermsPath) {
      router.replace("/terms");
      return;
    }

    if (!termsPending && isTermsPath) {
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
    isTermsPath,
  ]);

  if (isLoading || !user) {
    return (
      <div className="container space-top" role="status">
        <p>Carregando...</p>
      </div>
    );
  }

  if (termsPending && !isTermsPath) {
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
