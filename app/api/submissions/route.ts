import { submissionSchema } from "@/app/problems/[id]/submissionSchema";
import { LANGUAGE_MAP } from "@/components";
import prisma from "@/prisma/client";
import { Language, Problem, TestCase, Verdict } from "@prisma/client";
import { auth } from "@/auth";

const encoder = new TextEncoder();

export const POST = async (req: Request) => {
  const body = await req.json();

  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!,
    },
  });

  const validation = submissionSchema.safeParse(body);
  if (!validation.success) {
    throw new Error("Invalid data");
  }
  const { problemId, language, code, contestId } = validation.data;
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

  const readable = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(Verdict.PENDING));
      await new Promise((resolve) => setTimeout(resolve, 100));
      let verdict: Verdict = Verdict.PENDING,
        details = "Failed to run";
      for (let i = 0; i < testCases.length; i++) {
        controller.enqueue(encoder.encode("Running test case " + (i + 1)));
        const testCase = testCases[i];
        const res = await processTestCase(language, code, problem, testCase);
        if (res.status_id === 3) {
          verdict = Verdict.ACCEPTED;
        } else if (res.status_id === 4) {
          verdict = Verdict.WRONG_ANSWER;
          details = "Wrong Answer on test case " + (i + 1);
        } else if (res.status_id === 5) {
          verdict = Verdict.TIME_LIMIT_EXCEEDED;
          details = "Time Limit Exceeded on test case " + (i + 1);
        } else if (res.status_id === 6) {
          verdict = Verdict.COMPILATION_ERROR;
          details = `Compilation Error on test case ${i + 1}:\n ${res.stderr}`;
        } else {
          verdict = Verdict.RUNTIME_ERROR;
          details = `Runtime Error on test case ${i + 1}:\n ${res.stderr}`;
        }
      }

      await prisma.submission.create({
        data: {
          language,
          code,
          problemId,
          contestId,
          userId: user!.id,
          verdict,
          details,
        },
      });
      controller.close();
    },
  });
  return new Response(readable);
};

const processTestCase = async (
  language: Language,
  code: string,
  problem: Problem,
  testCase: TestCase
): Promise<{ stdout: string; stderr: string; status_id: number }> => {
  const JUDGE0_KEY = process.env.JUDGE0_AUTH_KEY;
  const JUDGE0_URL = process.env.JUDGE0_URL;
  const body = JSON.stringify({
    language_id: LANGUAGE_MAP[language],
    source_code: code,
    stdin: testCase.input,
    expected_output: testCase.output,
    cpu_time_limit: problem.timeLimit,
    memory_limit: problem.memoryLimit,
  });

  const submissionId = (
    await (
      await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-User": JUDGE0_KEY!,
        },
        body,
      })
    ).json()
  ).token;
  const submissionUrl = `${JUDGE0_URL}/submissions/${submissionId}?fields=stdout,stderr,status_id`;
  let tryCount = 0;
  while (tryCount < 10) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const submissionRes = await fetch(submissionUrl, {
      headers: {
        "X-Auth-User": JUDGE0_KEY!,
      },
      cache: "no-store",
    });
    const submissionData = await submissionRes.json();
    const status = submissionData.status_id;
    if (status === 3) {
      return submissionData;
    } else if (status > 3) {
      return submissionData;
    }
    tryCount++;
  }
  return { stdout: "", stderr: "", status_id: 0 };
};
