"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingSkeleton } from "@/components/feedback/loading-skeleton";
import { useSession } from "@/providers/session-provider";
import { checkAccess } from "@/lib/permissions/can";
import { getRoutePermission } from "@/lib/permissions/route-permissions";

export function GuardianGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useSession();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/signin");
      return;
    }

    const permission = getRoutePermission(window.location.pathname);
    if (!checkAccess(user.permissions, permission)) {
      router.replace("/signin?error=access-denied");
      return;
    }

    setAllowed(true);
  }, [user, isLoading, router]);

  if (isLoading || !allowed) {
    return <LoadingSkeleton rows={5} />;
  }

  return <>{children}</>;
}
