"use server";

import prisma from "@/prisma/client";
import { submissionSchema } from "./submissionSchema";
import { getServerSession } from "next-auth";
import authOptions from "@/auth/authOptions";

const onSolutionSubmission = async (
  dataStr: string,
  problemId: string,
  contestId?: string
) => {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!,
    },
  });

  const jsonData = JSON.parse(dataStr);
  const validation = submissionSchema.safeParse(jsonData);
  if (!validation.success) {
    throw new Error("Invalid data");
  }
  const data = validation.data;

  await prisma.submission.create({
    data: {
      ...data,
      problemId,
      contestId,
      userId: user!.id,
    },
  });
  return { ok: true };
};

export { onSolutionSubmission };
