import { z } from "zod";

export const tutorialSchema = z.object({
  contestId: z.string().optional(),
  description: z.string(),
  isHidden: z.boolean().optional(),
  problemId: z.string().optional(),
  title: z.string().min(5).max(255),
});

export type TutorialFormData = z.infer<typeof tutorialSchema>;
