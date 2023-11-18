"use server";

import prisma from "@/prisma/client";
import { testCaseSchema } from "./testCaseSchema";
import { getServerSession } from "next-auth";
import authOptions from "@/auth/authOptions";

const onSubmit = async (dataStr: string, problemId: string) => {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!,
    },
  });

  const jsonData = JSON.parse(dataStr);
  const validation = testCaseSchema.safeParse(jsonData);
  if (!validation.success) {
    throw new Error("Invalid data");
  }
  const data = validation.data;

  await prisma.testCase.create({
    data: {
      ...data,
      problemId,
      userId: user!.id,
    },
  });
  return { ok: true };
};

const generateOutput = async (inputs: string, problemId: string) => {
  console.log(inputs, problemId);
  // ToDo: Logic for getting output
  return "this is output";
};

export { onSubmit, generateOutput };
