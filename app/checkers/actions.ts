"use server";

import prisma from "@/prisma/client";
import { checkerSchema } from "./checkerSchema";

const onSubmit = async (dataStr: string) => {
  const jsonData = JSON.parse(dataStr);
  const validation = checkerSchema.safeParse(jsonData);
  if (!validation.success) {
    throw new Error("Invalid data");
  }
  const data = validation.data;

  await prisma.checker.create({
    data: {
      ...data,
    },
  });
  return { ok: true };
};

export { onSubmit };
