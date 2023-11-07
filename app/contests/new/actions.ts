"use server";

import authOptions from "@/auth/authOptions";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { contestSchema } from "./schema";

const onSubmit = async (dataStr: string) => {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!,
    },
  });

  const jsonData = JSON.parse(dataStr);
  const validation = contestSchema.safeParse(jsonData);
  if (!validation.success) {
    throw new Error("Invalid data");
  }
  const data = validation.data;

  await prisma.contest.create({
    data: {
      ...data,
      userId: user!.id,
    },
  });
  return { ok: true };
};

export { onSubmit };
