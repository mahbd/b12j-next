"use server";

import prisma from "@/prisma/client";
import { problemSchema } from "./problemSchema";
import { notFound, redirect } from "next/navigation";
import { isLogged, permissionOwnerStaff } from "@/components/helpers";

export const createOrUpdateProblem = async (
  dataStr: string,
  problemId?: string
) => {
  const user = await isLogged(
    "/api/auth/signin?callbackUrl=/problems/new/edit"
  );

  const jsonData = JSON.parse(dataStr);
  const validation = problemSchema.safeParse(jsonData);
  if (!validation.success) {
    return { ok: false, message: validation.error.toString() };
  }
  const data = { ...validation.data, languages: undefined };
  if (problemId) {
    const problem = await prisma.problem.findUnique({
      where: {
        id: problemId,
      },
    });
    if (!problem) {
      notFound();
    }
    if (!permissionOwnerStaff(user, problem)) {
      redirect("/denied");
    }
    try {
      await prisma.problem.update({
        where: {
          id: problemId,
        },
        data,
      });
    } catch (e: any) {
      console.error(e);
      return { ok: false, message: e.toString() };
    }
  } else {
    try {
      await prisma.problem.create({
        data: { ...data, userId: user.id },
      });
    } catch (e: any) {
      console.error(e);
      return { ok: false, message: e.toString() };
    }
  }
  return { ok: true };
};
