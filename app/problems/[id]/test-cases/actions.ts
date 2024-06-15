"use server";

import prisma from "@/prisma/client";
import { testCaseSchema } from "./testCaseSchema";
import { notFound, redirect } from "next/navigation";
import { isLogged } from "@/components/helpers";

export const createOrUpdateTestCase = async (
  dataStr: string,
  testCaseId?: string
) => {
  const user = await isLogged(`/api/auth/signin?callbackUrl=/problems/`);

  const jsonData = JSON.parse(dataStr);
  const validation = testCaseSchema.safeParse(jsonData);
  if (!validation.success) {
    return { ok: false, message: validation.error.toString() };
  }
  const data = validation.data;

  const problem = await prisma.problem.findUnique({
    where: {
      id: data.problemId,
    },
  });
  if (!problem) {
    notFound();
  }
  if (problem.userId !== user.id) {
    return redirect("/denied");
  }
  try {
    if (testCaseId) {
      await prisma.testCase.update({
        where: {
          id: testCaseId,
        },
        data,
      });
    } else {
      await prisma.testCase.create({
        data,
      });
    }
  } catch (e: any) {
    console.error(e);
    return { ok: false, message: e.toString() };
  }
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
      language_id: 54, // TODO: Add language selection
      source_code: sourceCode,
      stdin: stdin,
      cpu_time_limit: timeLimit,
      memory_limit: memoryLimit,
    }),
  });

  const data = await res.json();
  const submissionId = data.token;
  console.log("Submission ID", submissionId);
  const submissionUrl = `${JUDGE0_URL}/submissions/${submissionId}?fields=stdout,stderr,status_id&base64_encoded=true`;
  console.log("Submission URL", submissionUrl);
  let tryCount = 0;
  while (tryCount < 20) {
    const submissionRes = await fetch(submissionUrl + `&cnt=${tryCount}`, {
      headers: {
        "X-Auth-User": JUDGE0_KEY!,
      },
      cache: "no-store",
    });
    const submissionData = await submissionRes.json();
    console.log("Submission data", submissionData);
    const status = submissionData.status_id;
    if (status === 3) {
      // decode base64
      const decodedOutput = Buffer.from(
        submissionData.stdout,
        "base64"
      ).toString("utf-8");
      return { ok: true, message: decodedOutput };
    } else if (status > 3) {
      const decodedError = Buffer.from(
        submissionData.stderr,
        "base64"
      ).toString("utf-8");
      return { ok: false, message: decodedError };
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    tryCount++;
    console.log("tryCount", tryCount, "status", status);
  }
  return { ok: false, message: "Time limit exceeded" };
};

export const deleteTestCase = async (testCaseId: string) => {
  await prisma.testCase.delete({
    where: {
      id: testCaseId,
    },
  });
  return { ok: true };
};
