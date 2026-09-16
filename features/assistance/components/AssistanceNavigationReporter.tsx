"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { shouldReportAssistanceNavigation } from "@/features/assistance/navigation";
import { isAssistanceReadOnly } from "@/features/assistance/assistance-session";
import { useSession } from "@/providers/session-provider";
import { BffClientError } from "@/services/bff/client";
import { assistanceBff } from "@/services/bff/assistance.bff";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Fire-and-forget navigation audit while support assistance is active.
 * Failures must never block portal navigation.
 */
export function AssistanceNavigationReporter() {
  const pathname = usePathname() ?? "/";
  const { user } = useSession();
  const queryClient = useQueryClient();
  const lastReportedPathRef = useRef<string | null>(null);
  const expiryHandledRef = useRef(false);
  const assistanceActive = isAssistanceReadOnly(user);

  useEffect(() => {
    if (!assistanceActive) {
      lastReportedPathRef.current = null;
      return;
    }

    const decision = shouldReportAssistanceNavigation({
      assistanceActive: true,
      pathname,
      lastReportedPath: lastReportedPathRef.current,
    });

    if (!decision.report) return;

    lastReportedPathRef.current = decision.payload.path;

    void (async () => {
      try {
        await assistanceBff.navigate(decision.payload);
      } catch (error) {
        const expired =
          error instanceof BffClientError &&
          (error.errorCode === "support_assistance_expired" ||
            (error.type ?? "").includes("support-assistance-expired"));

        if (!expired || expiryHandledRef.current) return;

        expiryHandledRef.current = true;
        let redirectTo: string | null = null;
        try {
          const result = await assistanceBff.end();
          redirectTo = result.redirectTo;
        } catch {
          // cookies may already be cleared
        } finally {
          queryClient.clear();
          window.location.assign(redirectTo ?? "/signin");
        }
      }
    })();
  }, [assistanceActive, pathname, queryClient]);

  return null;
}
