import { z } from "zod";

export const testCaseSchema = z.object({
  input: z.string().min(1).max(65000),
  output: z.string().min(1).max(65000),
});
