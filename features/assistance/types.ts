import type { SessionUser } from "@/types/session";

export type AssistanceAdoptResult = {
  redirectTo: string;
  /** Present when /me succeeded after adopt; client invalidates auth.me either way. */
  session?: SessionUser | null;
};

export type AssistanceEndResult = {
  ok: true;
  redirectTo: string;
};

export type AssistanceNavigateResult = {
  recorded: boolean;
  deduplicated?: boolean;
};
