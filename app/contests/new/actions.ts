"use server";

import authOptions from "@/auth/authOptions";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { contestSchema } from "./schema";
import { notFound, redirect } from "next/navigation";
import { permissionOwnerStaff } from "@/components/helpers";
import { ContestProblem } from "@prisma/client";

export const createOrUpdateContest = async (
  dataStr: string,
  contestId?: string
) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/api/auth/signin?callbackUrl=/contests/new");
  }
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
  if (contestId) {
    const contest = await prisma.contest.findUnique({
      where: {
        id: contestId,
      },
    });
    if (!contest) {
      notFound();
    }
    if (permissionOwnerStaff(user, contest)) {
      redirect("/denied");
    }
    await prisma.contest.update({
      where: {
        id: contestId,
      },
      data,
    });
  } else {
    await prisma.contest.create({
      data: {
        ...data,
        userId: user!.id,
      },
    });
  }
  return { ok: true };
};

export const addProblemToContest = async (
  contestId: string,
  problemId: string,
  problemIndex: string
) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect(`/api/auth/signin?callbackUrl=/contests/${contestId}/problems`);
  }
  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!,
    },
  });

  const contest = await prisma.contest.findUnique({
    where: {
      id: contestId,
    },
  });
  if (!contest) {
    notFound();
  }
  if (!permissionOwnerStaff(user, contest)) {
    redirect("/denied");
  }
  // check if already added
  const problem = await prisma.contestProblem.findUnique({
    where: {
      contestId_problemId: {
        problemId,
        contestId,
      },
    },
  });
  if (problem) {
    return { ok: false, message: "Problem already added" };
  }

  await prisma.contestProblem.create({
    data: {
      problemId,
      contestId,
      problemIndex,
    },
  });
  return { ok: true };
};

export const removeProblemFromContest = async (
  contestProblem: ContestProblem
) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect(
      `/api/auth/signin?callbackUrl=/contests/${contestProblem.contestId}/problems`
    );
  }
  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!,
    },
  });

  const contest = await prisma.contest.findUnique({
    where: {
      id: contestProblem.contestId,
    },
  });
  if (!contest) {
    notFound();
  }
  if (!permissionOwnerStaff(user, contest)) {
    redirect("/denied");
  }

  await prisma.contestProblem.delete({
    where: {
      id: contestProblem.id,
    },
  });
  return { ok: true };
};
