"use server";

import prisma from "@/prisma/client";
import { contestSchema } from "./contestSchema";
import { notFound, redirect } from "next/navigation";
import { isLogged, permissionOwnerStaff } from "@/components/helpers";

export const createOrUpdateContest = async (
  dataStr: string,
  contestId?: string
) => {
  const user = await isLogged(
    "/api/auth/signin?callbackUrl=/contests/new/edit"
  );

  const jsonData = JSON.parse(dataStr);
  const validation = contestSchema.safeParse(jsonData);
  if (!validation.success) {
    return { ok: false, message: validation.error.toString() };
  }
  const data = { ...validation.data, problems: undefined };
  const problems = validation.data.problems || [];
  if (contestId) {
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
    try {
      await prisma.contest.update({
        where: {
          id: contestId,
        },
        data,
      });
      await prisma.contestProblem.deleteMany({
        where: {
          contestId,
        },
      });
      if (problems.length > 0) {
        await prisma.contestProblem.createMany({
          data: problems,
        });
      }
    } catch (e: any) {
      console.error(e);
      return { ok: false, message: e.toString() };
    }
  } else {
    try {
      await prisma.contest.create({
        data: {
          ...data,
          userId: user!.id,
          problems: {
            create: problems,
          },
        },
      });
    } catch (e: any) {
      console.error(e);
      return { ok: false, message: e.toString() };
    }
  }
  return { ok: true };
};
