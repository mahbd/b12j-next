"use server";

import { LANGUAGE_MAP, isLogged } from "@/components/helpers";
import { submissionSchema } from "./submissionSchema";
import prisma from "@/prisma/client";
import { Verdict } from "@prisma/client";

export const createSubmission = async (
  dataStr: string
): Promise<{ ok: boolean; message: string }> => {
  const user = await isLogged(`/api/auth/signin?callbackUrl=/problems/`);
  const jsonData = JSON.parse(dataStr);
  const validation = submissionSchema.safeParse(jsonData);
  if (!validation.success) {
    return { ok: false, message: validation.error.toString() };
  }
  const data = validation.data;

  try {
    const submission = await prisma.submission.create({
      data: { ...data, userId: user.id },
    });

    await requestJudge0(0, submission.id);
  } catch (e: any) {
    console.error(e);
    return { ok: false, message: e.toString() };
  }
  return { ok: true, message: "Submission created" };
};

export const requestJudge0 = async (
  testNumber: number,
  submissionId: string
) => {
  const submission = await prisma.submission.findUnique({
    where: {
      id: submissionId,
    },
    include: { problem: true },
  });
  if (!submission) {
    return { ok: false, message: "Submission not found" };
  }
  const testCases = await prisma.testCase.findMany({
    where: {
      problemId: submission.problemId,
    },
    orderBy: {
      id: "asc",
    },
  });

  if (testNumber >= testCases.length) {
    return { ok: false, message: "All tests has been completed" };
  }

  const testCase = testCases[testNumber];
  const frontUrl = process.env.FRONT_URL;
  const callbackUrl = `${frontUrl}/api/submissions?testNumber=${
    testNumber + 1
  }&submissionId=${submissionId}`;

  const JUDGE0_KEY = process.env.JUDGE0_AUTH_KEY;
  const JUDGE0_URL = process.env.JUDGE0_URL;
  const body = JSON.stringify({
    language_id: LANGUAGE_MAP[submission.language],
    source_code: Buffer.from(submission.code).toString("base64"),
    stdin: Buffer.from(testCase.input).toString("base64"),
    expected_output: Buffer.from(testCase.output).toString("base64"),
    cpu_time_limit: submission.problem.timeLimit,
    memory_limit: submission.problem.memoryLimit,
    callback_url: callbackUrl,
  });

  await fetch(
    `${JUDGE0_URL}/submissions?base64_encoded=true&X-Auth-User=${JUDGE0_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    }
  );

  await prisma.submission.update({
    where: {
      id: submissionId,
    },
    data: {
      verdict: Verdict.RUNNING,
      details: `Running test case ${testNumber + 1}...`,
    },
  });
};
