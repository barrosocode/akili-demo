"use client";

import { usePathname } from "next/navigation";

import {
  supportActionAudienceFor,
  supportPathsFor,
  type SupportActionAudience,
  type SupportPathSet,
} from "@/features/support/lib/paths";

export function useSupportPaths(): SupportPathSet {
  const pathname = usePathname() ?? "";
  return supportPathsFor(pathname);
}

export function useSupportActionAudience(): SupportActionAudience {
  const pathname = usePathname() ?? "";
  return supportActionAudienceFor(pathname);
}
