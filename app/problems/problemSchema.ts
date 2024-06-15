import z from "zod";

const problemSchema = z.object({
  correctCode: z.string(),
  description: z.string().min(1).max(10000),
  isHidden: z.boolean(),
  input: z.string().min(1).max(10000),
  memoryLimit: z.number().int().min(262144).max(524288),
  output: z.string().min(1).max(10000),
  timeLimit: z.number().int().min(1).max(10),
  title: z.string().min(1).max(255),
});

export type ProblemFormData = z.infer<typeof problemSchema>;
export { problemSchema };
