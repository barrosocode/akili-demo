"use client";

import { useQuery } from "@tanstack/react-query";
import { queryConfig } from "@/lib/cache/query-config";
import { supportBff } from "@/services/bff/support.bff";
import { queryKeys } from "@/services/queries/query-keys";

export function useSupportTopicsQuery() {
  return useQuery({
    queryKey: queryKeys.support.topics(),
    queryFn: () => supportBff.listTopics(),
    staleTime: queryConfig.staleTime,
  });
}

export function useSupportTopicQuery(uuid: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.support.topic(uuid),
    queryFn: () => supportBff.getTopic(uuid),
    enabled: Boolean(uuid) && enabled,
    staleTime: queryConfig.staleTime,
  });
}

export function useSupportFaqQuery(uuid: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.support.faq(uuid),
    queryFn: () => supportBff.getFaq(uuid),
    enabled: Boolean(uuid) && enabled,
    staleTime: queryConfig.staleTime,
  });
}

export function useSupportSearchQuery(search: string, enabled = true) {
  const trimmed = search.trim();
  return useQuery({
    queryKey: queryKeys.support.search(trimmed),
    queryFn: () => supportBff.search(trimmed),
    enabled: enabled && trimmed.length > 0,
    staleTime: queryConfig.staleTime,
  });
}
