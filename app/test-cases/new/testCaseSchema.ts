import { z } from "zod";

export const testCaseSchema = z.object({
  inputs: z.string().min(1).max(65000),
  outputs: z.string().min(1).max(65000),
});
