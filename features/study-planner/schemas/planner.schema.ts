import { z } from "zod";

const timeHm = z
  .string()
  .regex(/^\d{2}:\d{2}$/, "Informe o horário no formato 14:00");

const weekdayIso = z.enum([
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
]);

const dateYmd = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe uma data válida");

export const guardianStudyPlannerSchema = z
  .object({
    inverted_classroom: z.boolean(),
    spaced_review: z.boolean(),
    review_model: z.enum(["dehaene", "custom", "livre"]),
    items_per_session: z.union([z.literal(""), z.coerce.number().int().min(1).max(4)]),
    tdah_adjustment: z.boolean(),
    on_medication: z.boolean(),
    availability: z.array(
      z.object({
        weekday: weekdayIso,
        starts_at: timeHm,
        ends_at: timeHm,
        is_recurring: z.boolean(),
      })
    ),
    school_schedule: z.array(
      z.object({
        weekday: weekdayIso,
        subject_uuid: z.string().min(1, "Escolha a disciplina"),
      })
    ),
    starts_on: dateYmd,
    content_deadline_on: dateYmd,
    blocked_dates: z.array(dateYmd),
    exams: z.array(
      z.object({
        date: dateYmd,
        subject_uuid: z.string().min(1, "Escolha a disciplina da prova"),
      })
    ),
    topics: z.array(
      z.object({
        topic_uuid: z.string().min(1),
        name: z.string(),
        selected: z.boolean(),
        difficulty_level: z.enum(["N1", "N2", "N3", "N4", "N5"]),
        needs_reinforcement: z.boolean(),
      })
    ),
  })
  .superRefine((values, ctx) => {
    values.availability.forEach((slot, index) => {
      if (slot.ends_at <= slot.starts_at) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "O fim precisa ser depois do início",
          path: ["availability", index, "ends_at"],
        });
      }
    });

    if (values.content_deadline_on < values.starts_on) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "O prazo precisa ser no mesmo dia ou depois do início",
        path: ["content_deadline_on"],
      });
    }

    if (!values.topics.some((topic) => topic.selected)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Escolha pelo menos um tópico para o roteiro.",
        path: ["topics"],
      });
    }
  });

export type GuardianStudyPlannerValues = z.infer<
  typeof guardianStudyPlannerSchema
>;
