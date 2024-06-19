"use server";

import prisma from "@/prisma/client";
import { contestSchema } from "./contestSchema";
import { notFound, redirect } from "next/navigation";
import { isLogged, permissionOwnerStaff } from "@/components/helpers";

export const createOrUpdateContest = async (
  dataStr: string,
  contestId?: string
) => {
  const user = await isLogged(`/contests/${contestId || "new"}/edit`);

  const jsonData = JSON.parse(dataStr);
  const validation = contestSchema.safeParse(jsonData);
  if (!validation.success) {
    return { ok: false, message: validation.error.toString() };
  }
  const data = {
    ...validation.data,
    problems: undefined,
    moderators: undefined,
  };
  const problems = validation.data.problems || [];
  const moderators = validation.data.moderators || [];
  console.log(moderators);
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
      await prisma.contestModerator.deleteMany({
        where: {
          contestId,
        },
      });
      await prisma.contestProblem.deleteMany({
        where: {
          contestId,
        },
      });
      if (moderators.length > 0) {
        await prisma.contestModerator.createMany({
          data: moderators.map((moderator) => ({
            contestId: contestId,
            userId: moderator.userId!,
          })),
        });
      }
      if (problems.length > 0) {
        await prisma.contestProblem.createMany({
          data: problems.map((problem) => ({
            contestId: contestId,
            problemId: problem.problemId!,
            problemIndex: problem.problemIndex!,
          })),
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
            create: problems.map((problem) => ({
              problemId: problem.problemId!,
              problemIndex: problem.problemIndex!,
            })),
          },
          moderators: {
            create: moderators.map((moderator) => ({
              userId: moderator.userId!,
            })),
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
