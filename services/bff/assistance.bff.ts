import { bffClient } from "@/services/bff/client";
import type {
  AssistanceAdoptResult,
  AssistanceEndResult,
  AssistanceNavigateResult,
} from "@/features/assistance/types";

export const assistanceBff = {
  adopt(payload: { code: string }) {
    return bffClient<AssistanceAdoptResult>("/api/assistance/adopt", {
      method: "POST",
      body: payload,
    });
  },

  end() {
    return bffClient<AssistanceEndResult>("/api/assistance/end", {
      method: "POST",
    });
  },

  navigate(payload: { path: string; page_label: string }) {
    return bffClient<AssistanceNavigateResult>("/api/assistance/navigate", {
      method: "POST",
      body: payload,
    });
  },
};
