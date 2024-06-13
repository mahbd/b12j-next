import z from "zod";

const problemSchema = z.object({
  checkerId: z.string(),
  correctCode: z.string(),
  description: z.string().min(1).max(10000),
  isHidden: z.boolean(),
  input: z.string().min(1).max(10000),
  output: z.string().min(1).max(10000),
  title: z.string().min(1).max(255),
});

export type ProblemFormData = z.infer<typeof problemSchema>;
export { problemSchema };
