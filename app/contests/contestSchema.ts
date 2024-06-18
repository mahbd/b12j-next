import { z } from "zod";

export const contestSchema = z.object({
  description: z.string().min(0).max(10000),
  endTime: z.coerce.date(),
  moderators: z.array(
    z.object({
      userId: z.string().optional(),
    })
  ),
  problems: z.array(
    z.object({
      problemId: z.string().optional(),
      problemIndex: z.string().min(1).max(3).optional(),
    })
  ),
  startTime: z.coerce.date(),
  title: z.string().min(5).max(255),
});

export type ContestFormData = z.infer<typeof contestSchema>;
