import type { UpdateGuardianProfileValues } from "@/features/profile/schemas/profile.schema";
import { bffClient } from "@/services/bff/client";
import type { GuardianProfile } from "@/types/guardian-profile";

export const profileBff = {
  get() {
    return bffClient<GuardianProfile>("/api/profile");
  },

  update(payload: UpdateGuardianProfileValues) {
    return bffClient<GuardianProfile>("/api/profile", {
      method: "PATCH",
      body: payload,
    });
  },
};
