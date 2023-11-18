import { Language } from "@prisma/client";
import { z } from "zod";

export const submissionSchema = z.object({
  language: z.nativeEnum(Language),
  code: z.string().min(50).max(65000),
});
