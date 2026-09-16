"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { BffClientError } from "@/services/bff/client";
import { assistanceBff } from "@/services/bff/assistance.bff";
import { useSession } from "@/providers/session-provider";
import { endAuthenticatedTawkSession } from "@/features/support/tawk";

/**
 * Quando a sessão de assistência deixa de ser válida no /me,
 * limpa cookies via BFF end e devolve o operador ao Admin.
 */
export function AssistanceExpiryWatcher() {
  const { user, isLoading } = useSession();
  const queryClient = useQueryClient();
  const handlingRef = useRef(false);
  const hadAssistanceRef = useRef(false);

  useEffect(() => {
    if (user?.assistance?.active) {
      hadAssistanceRef.current = true;
    }
  }, [user?.assistance?.active]);

  useEffect(() => {
    if (isLoading || handlingRef.current) return;
    if (!hadAssistanceRef.current) return;
    if (user?.assistance?.active) return;

    handlingRef.current = true;

    void (async () => {
      let redirectTo: string | null = null;
      try {
        const result = await assistanceBff.end();
        redirectTo = result.redirectTo;
      } catch (error) {
        if (!(error instanceof BffClientError)) {
          // ignore
        }
      } finally {
        await endAuthenticatedTawkSession();
        queryClient.clear();
        if (redirectTo) {
          window.location.assign(redirectTo);
        } else {
          window.location.assign("/signin");
        }
      }
    })();
  }, [isLoading, queryClient, user]);

  return null;
}
