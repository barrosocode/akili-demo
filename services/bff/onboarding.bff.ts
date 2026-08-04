import { bffClient } from "@/services/bff/client";
import type { ChildSummary } from "@/types/domain/child";

export const onboardingBff = {
  completeFirstChild(payload: Record<string, unknown>) {
    return bffClient<ChildSummary>("/api/onboarding/first-child", {
      method: "POST",
      body: payload,
    });
  },
};
