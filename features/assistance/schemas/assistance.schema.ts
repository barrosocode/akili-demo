import { z } from "zod";

export const adoptAssistanceSchema = z
  .object({
    code: z.string().min(32).max(128),
  })
  .strict();

export const navigateAssistanceSchema = z
  .object({
    path: z.string().min(1).max(500),
    page_label: z.string().max(120).optional().nullable(),
  })
  .strict();
