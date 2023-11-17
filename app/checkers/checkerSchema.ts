import { Language } from "@prisma/client";
import { z } from "zod";

export const checkerSchema = z.object({
  language: z.nativeEnum(Language),
  name: z.string().min(10).max(255),
  source: z.string().min(50).max(65000),
});
