"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { endAuthenticatedTawkSession } from "@/features/support/tawk";
import { demoBff } from "@/services/bff/demo.bff";
import { queryKeys } from "@/services/queries/query-keys";
import type { DemoPersonaKey } from "@/types/demo";
import type { LoginSuccessPayload } from "@/types/auth-login";
import type { SessionUser } from "@/types/session";

function isGuardianSession(
  payload: LoginSuccessPayload
): payload is LoginSuccessPayload & { session: SessionUser } {
  return payload.portal === "guardian";
}

export function useSwitchDemoPersonaMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (key: DemoPersonaKey) => demoBff.issuePersonaToken(key),
    onSuccess: async (result) => {
      await endAuthenticatedTawkSession();
      queryClient.removeQueries({ queryKey: queryKeys.support.tawkIdentityRoot });
      if (isGuardianSession(result)) {
        queryClient.setQueryData(queryKeys.auth.me, result.session);
        void queryClient.invalidateQueries({ queryKey: queryKeys.demo.all });
      }
    },
  });
}
