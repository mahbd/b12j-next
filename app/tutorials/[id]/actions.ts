"use server";

import { isLogged, permissionOwnerStaff } from "@/components/helpers";
import prisma from "@/prisma/client";
import { tutorialSchema } from "./tutorialSchema";
import { redirect } from "next/navigation";

export const createOrUpdateTutorial = async (
  dataStr: string,
  tutorialId?: string
) => {
  const user = await isLogged(`/tutorials/${tutorialId || "new"}/edit`);

  const jsonData = JSON.parse(dataStr);
  const validation = tutorialSchema.safeParse(jsonData);
  if (!validation.success) {
    return { ok: false, message: validation.error.toString() };
  }
  if (validation.data.problemId === "") {
    validation.data.problemId = undefined;
  }
  if (validation.data.contestId === "") {
    validation.data.contestId = undefined;
  }

  if (tutorialId) {
    const tutorial = await prisma.tutorial.findUnique({
      where: {
        id: tutorialId,
      },
    });
    if (!tutorial) {
      return { ok: false, message: "Tutorial not found" };
    }
    if (!permissionOwnerStaff(user, tutorial)) {
      redirect("/denied");
    }
    try {
      await prisma.tutorial.update({
        where: {
          id: tutorialId,
        },
        data: validation.data,
      });
    } catch (e: any) {
      console.error(e);
      return { ok: false, message: e.toString() };
    }
  } else {
    try {
      await prisma.tutorial.create({
        data: { ...validation.data, userId: user.id },
      });
    } catch (e: any) {
      console.error(e);
      return { ok: false, message: e.toString() };
    }
  }
  return { ok: true, message: "Tutorial created" };
};
