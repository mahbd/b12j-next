import z from "zod";
import { Language } from "@prisma/client";

const problemSchema = z.object({
  checkerId: z.string(),
  correctCode: z.string(),
  correctLanguage: z.nativeEnum(Language),
  description: z.string().min(1).max(10000),
  inputTerms: z.string().min(1).max(10000),
  outputTerms: z.string().min(1).max(10000),
  title: z.string().min(1).max(255),
});

export type ProblemFormData = z.infer<typeof problemSchema>;
export { problemSchema };
