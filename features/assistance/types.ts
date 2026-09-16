import type { SessionUser } from "@/types/session";

export type AssistanceAdoptResult = {
  redirectTo: string;
  session: SessionUser;
};

export type AssistanceEndResult = {
  ok: true;
  redirectTo: string;
};

export type AssistanceNavigateResult = {
  recorded: boolean;
  deduplicated?: boolean;
};
