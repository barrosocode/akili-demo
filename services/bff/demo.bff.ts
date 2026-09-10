import { bffClient } from "@/services/bff/client";
import type { DemoAdoptResult, DemoPersona, DemoPersonaKey, DemoSwitchResult } from "@/types/demo";

export const demoBff = {
  listPersonas() {
    return bffClient<DemoPersona[]>("/api/demo/personas");
  },

  issuePersonaToken(key: DemoPersonaKey) {
    return bffClient<DemoSwitchResult>(
      `/api/demo/personas/${encodeURIComponent(key)}/token`,
      { method: "POST" }
    );
  },

  adopt(payload: { token: string }) {
    return bffClient<DemoAdoptResult>("/api/demo/adopt", {
      method: "POST",
      body: payload,
    });
  },
};
