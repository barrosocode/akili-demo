"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authBff } from "@/services/bff/auth.bff";
import { queryKeys } from "@/services/queries/query-keys";
import type { AcceptInviteRequest, LoginRequest, SignupRequest } from "@/types/auth";

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginRequest) => authBff.login(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.auth.me, user);
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
    onSuccess: () => {
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
