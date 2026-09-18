"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endAuthenticatedTawkSession } from "@/features/support/tawk";
import { authBff } from "@/services/bff/auth.bff";
import { queryKeys } from "@/services/queries/query-keys";
import type { AcceptInviteRequest, LoginRequest, SignupRequest } from "@/types/auth";
import type { LoginSuccessPayload } from "@/types/auth-login";
import type { SessionUser } from "@/types/session";

function isGuardianSession(
  payload: LoginSuccessPayload
): payload is LoginSuccessPayload & { session: SessionUser } {
  return payload.portal === "guardian";
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginRequest) => authBff.login(payload),
    onSuccess: (result) => {
      if (isGuardianSession(result)) {
        queryClient.setQueryData(queryKeys.auth.me, result.session);
      }
    },
  });
}

export function useSignupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SignupRequest) => authBff.signup(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.auth.me, user);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authBff.logout(),
    onSuccess: async () => {
      await endAuthenticatedTawkSession();
      queryClient.removeQueries({ queryKey: queryKeys.support.tawkIdentityRoot });
      queryClient.removeQueries({ queryKey: queryKeys.auth.me });
      queryClient.clear();
    },
  });
}

export function useAcceptInviteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AcceptInviteRequest) => authBff.acceptInvite(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.auth.me, user);
    },
  });
}
