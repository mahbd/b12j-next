import { z } from "zod";

export const contestSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(10000),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
});
