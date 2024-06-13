"use server";

import prisma from "@/prisma/client";
import { testCaseSchema } from "./new/testCaseSchema";
import { notFound } from "next/navigation";
import { LANGUAGE_MAP } from "@/app/components";
import { auth } from "@/auth";

export const createNewTestCase = async (dataStr: string, problemId: string) => {
  const session = await auth();
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

export const generateOutput = async (inputs: string, problemId: string) => {
  const problem = await prisma.problem.findUnique({
    where: {
      id: problemId,
    },
  });
  if (!problem) {
    notFound();
  }
  const sourceCode = problem.correctCode;
  const timeLimit = problem.timeLimit;
  const memoryLimit = problem.memoryLimit;
  const stdin = inputs;
  const JUDGE0_KEY = process.env.JUDGE0_AUTH_KEY;
  const JUDGE0_URL = process.env.JUDGE0_URL;

  const res = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-User": JUDGE0_KEY!,
    },
    body: JSON.stringify({
      language_id: 10, // TODO: Add language selection
      source_code: sourceCode,
      stdin: stdin,
      cpu_time_limit: timeLimit,
      memory_limit: memoryLimit,
    }),
  });

  const data = await res.json();
  const submissionId = data.token;
  const submissionUrl = `${JUDGE0_URL}/submissions/${submissionId}?fields=stdout,stderr,status_id`;
  let tryCount = 0;
  while (tryCount < 10) {
    const submissionRes = await fetch(submissionUrl, {
      headers: {
        "X-Auth-User": JUDGE0_KEY!,
      },
      cache: "no-store",
    });
    const submissionData = await submissionRes.json();
    const status = submissionData.status_id;
    if (status === 3) {
      return submissionData.stdout;
    } else if (status > 3) {
      return submissionData.stderr;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    tryCount++;
    console.log("tryCount", tryCount, "status", status);
  }
  return "Time limit exceeded";
};

export const deleteTestCase = async (testCaseId: string) => {
  await prisma.testCase.delete({
    where: {
      id: testCaseId,
    },
  });
  return { ok: true };
};
