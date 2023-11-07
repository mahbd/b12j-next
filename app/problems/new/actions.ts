"use server";

import authOptions from "@/auth/authOptions";
import prisma from "@/prisma/client";
import { Language } from "@prisma/client";
import { getServerSession } from "next-auth";
import { problemSchema } from "./schema";

const onSubmit = async (dataStr: string) => {
  const session = await getServerSession(authOptions);
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
      correctLanguage: data.correctLanguage as Language,
      userId: user!.id,
    },
  });
  return { ok: true };
};

export { onSubmit };
