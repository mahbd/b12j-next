"use server";

import prisma from "@/prisma/client";
import { submissionSchema } from "./submissionSchema";
import { getServerSession } from "next-auth";
import authOptions from "@/auth/authOptions";
import { LANGUAGE_MAP } from "@/components";
import { Verdict } from "@prisma/client";

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
  const problem = await prisma.problem.findUnique({
    where: {
      id: problemId,
    },
  });
  if (!problem) {
    throw new Error("Problem not found");
  }

  const testCases = await prisma.testCase.findMany({
    where: {
      problemId,
    },
  });
  if (testCases.length === 0) {
    throw new Error("No test cases found");
  }

  const JUDGE0_KEY = process.env.JUDGE0_AUTH_KEY;
  const JUDGE0_URL = process.env.JUDGE0_URL;
  const submissions = [];
  for (const testCase of testCases) {
    submissions.push({
      language_id: LANGUAGE_MAP[data.language],
      source_code: data.code,
      stdin: testCase.inputs,
      expected_output: testCase.outputs,
      cpu_time_limit: problem.timeLimit,
      memory_limit: problem.memoryLimit,
    });
  }

  const res = await fetch(
    `${JUDGE0_URL}/submissions/batch?base64_encoded=false`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-User": JUDGE0_KEY!,
      },
      body: JSON.stringify({
        submissions,
      }),
    }
  );
  const tokens = (await res.json())
    .map((token: { token: string }) => token.token)
    .filter((token: string) => token !== undefined)
    .filter((token: string) => token !== null)
    .filter((token: string) => token !== "")
    .join(",");

  const submissionUrl = `${JUDGE0_URL}/submissions/batch?tokens=${tokens}&fields=stdout,stderr,status_id`;
  let tryCount = 0;
  while (tryCount < 10) {
    const submissionRes = await fetch(submissionUrl, {
      headers: {
        "X-Auth-User": JUDGE0_KEY!,
      },
      cache: "no-store",
    });
    const statusIds: number[] = (await submissionRes.json()).submissions.map(
      (res: { stdout: string; stderr: string; status_id: number }) =>
        res.status_id
    );
    // check if 1 or 2 in statusIds
    const pending = statusIds.find((id: number) => id === 1 || id === 2);
    console.log("pending", pending);
    if (pending === undefined) {
      let verdict: Verdict = Verdict.PENDING;
      if (statusIds.every((id: number) => id === 3)) {
        verdict = Verdict.ACCEPTED;
      } else if (statusIds.includes(4)) {
        verdict = Verdict.WRONG_ANSWER;
      } else if (statusIds.includes(5)) {
        verdict = Verdict.TIME_LIMIT_EXCEEDED;
      } else if (statusIds.includes(6)) {
        verdict = Verdict.COMPILATION_ERROR;
      } else {
        verdict = Verdict.RUNTIME_ERROR;
      }
      await prisma.submission.create({
        data: {
          ...data,
          problemId,
          contestId,
          userId: user!.id,
          verdict,
        },
      });
      return { ok: true };
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    tryCount++;
    console.log("tryCount", tryCount, "status", statusIds);
  }

  return { ok: true };
};

export { onSolutionSubmission };
