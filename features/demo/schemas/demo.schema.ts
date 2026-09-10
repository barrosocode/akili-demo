import { z } from "zod";

import { DEMO_PERSONA_KEYS } from "@/types/demo";

export const adoptDemoTokenSchema = z.object({
  token: z
    .string()
    .trim()
    .min(8, "Token inválido")
    .max(2048, "Token inválido"),
});

export const demoPersonaKeySchema = z.enum(DEMO_PERSONA_KEYS);
