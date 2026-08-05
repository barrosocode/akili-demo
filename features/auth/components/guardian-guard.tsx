"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useSession } from "@/providers/session-provider";
import { checkAccess } from "@/lib/permissions/can";
import { getRoutePermission } from "@/lib/permissions/route-permissions";

/**
 * Garante sessão autenticada com permissão da rota.
 */
export function GuardianGuard({ children }: { children: ReactNode }) {
  const { user, isLoading } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const permission = getRoutePermission(pathname);
  const hasAccess = Boolean(
    user && checkAccess(user.permissions, permission),
  );

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/signin");
      return;
    }

    if (!hasAccess) {
      router.replace("/signin?error=access-denied");
    }
  }, [user, isLoading, router, hasAccess]);

  if (isLoading || !user || !hasAccess) {
    return (
      <div className="container space-top" role="status">
        <p>Carregando...</p>
      </div>
    );
  }

  return <>{children}</>;
}
