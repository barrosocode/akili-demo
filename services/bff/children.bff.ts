import { bffClient } from "@/services/bff/client";
import type { ChildProgress, ChildSummary } from "@/types/domain/child";

export const childrenBff = {
  list() {
    return bffClient<ChildSummary[]>("/api/guardian/children");
  },

  progress(ref: string) {
    return bffClient<ChildProgress>(`/api/guardian/children/${ref}/progress`);
  },

  create(payload: Record<string, unknown>) {
    return bffClient<ChildSummary>("/api/guardian/children", {
      method: "POST",
      body: payload,
    });
  },
};
