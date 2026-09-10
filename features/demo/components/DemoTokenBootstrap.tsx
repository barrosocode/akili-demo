"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { clearDemoTokenHash, readDemoTokenFromHash } from "@/lib/demo/token-hash";
import { demoBff } from "@/services/bff/demo.bff";
import { queryKeys } from "@/services/queries/query-keys";
import type { SessionUser } from "@/types/session";

function isGuardianSession(session: unknown): session is SessionUser {
  return Boolean(session && typeof session === "object" && "name" in session);
}

/**
 * Consome `#demo_token=` no boot (handoff do admin) e grava a sessão via BFF.
 */
export function DemoTokenBootstrap() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    const token = readDemoTokenFromHash(window.location.hash);
    if (!token) return;

    startedRef.current = true;
    clearDemoTokenHash();

    void (async () => {
      try {
        const result = await demoBff.adopt({ token });

        if (result.portal === "admin") {
          window.location.assign(result.redirectTo);
          return;
        }

        await queryClient.cancelQueries({ queryKey: queryKeys.auth.me });
        if (isGuardianSession(result.session)) {
          queryClient.setQueryData(queryKeys.auth.me, result.session);
        }
        await queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
        router.refresh();
      } catch {
        // Hash já foi limpo de propósito — o token não deve permanecer na URL.
      }
    })();
  }, [queryClient, router]);

  return null;
}
