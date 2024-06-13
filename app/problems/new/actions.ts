"use server";

import prisma from "@/prisma/client";
import { Language } from "@prisma/client";
import { problemSchema } from "./problemSchema";
import { auth } from "@/auth";

const onSubmit = async (dataStr: string) => {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!,
    },
  });

  const jsonData = JSON.parse(dataStr);
  const validation = problemSchema.safeParse(jsonData);
  if (!validation.success) {
    throw new Error("Invalid data");
  }
  const data = validation.data;

  await prisma.problem.create({
    data: {
      ...data,
      userId: user!.id,
    },
  });
  return { ok: true };
};

export { onSubmit };
