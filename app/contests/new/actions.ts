"use server";

import authOptions from "@/auth/authOptions";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { contestSchema } from "./schema";
import { notFound, redirect } from "next/navigation";
import { permissionOwnerStaff } from "@/components/helpers";

const createOrUpdateContest = async (dataStr: string, contestId?: string) => {
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

export { createOrUpdateContest };
