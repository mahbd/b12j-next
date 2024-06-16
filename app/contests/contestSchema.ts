import { z } from "zod";

export const contestSchema = z.object({
  description: z.string().min(0).max(10000),
  endTime: z.coerce.date(),
  problems: z
    .array(
      z.object({
        contestId: z.string().optional(),
        problemId: z.string().optional(),
        problemIndex: z
          .string()
          .min(1)
          .max(3)
          .toUpperCase()
          .default("A")
          .optional(),
      })
    )
    .optional(),
  startTime: z.coerce.date(),
  title: z.string().min(5).max(255),
});

export type ContestFormData = z.infer<typeof contestSchema>;
