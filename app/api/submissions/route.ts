import prisma from "@/prisma/client";
import { Verdict } from "@prisma/client";
import { requestJudge0 } from "@/app/problems/[id]/submissionActions";

interface J0Callback {
  stdout: string | null;
  time: string;
  memory: number;
  stderr: string | null;
  token: string;
  compile_output: string | null;
  message: string | null;
  status: {
    description: string;
    id: number;
  };
}

export const PUT = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const testNumber = Number.parseInt(searchParams.get("testNumber") || "");
  const submissionId = searchParams.get("submissionId");

  if (!testNumber || !submissionId) {
    return Response.json(
      { details: "Invalid data", testNumber, submissionId },
      { status: 400 }
    );
  }

  const submission = await prisma.submission.findUnique({
    where: {
      id: submissionId,
    },
  });

  if (!submission) {
    return Response.json({ details: "Submission not found" }, { status: 404 });
  }

  const testCasesCnt = await prisma.testCase.count({
    where: {
      problemId: submission.problemId,
    },
  });

  if (testNumber >= testCasesCnt) {
    if (submission.verdict === Verdict.PENDING || Verdict.RUNNING) {
      await prisma.submission.update({
        where: {
          id: submissionId,
        },
        data: {
          verdict: Verdict.ACCEPTED,
          details: "All test cases passed",
        },
      });
    }

    return Response.json(
      { details: "All tests has been completed" },
      { status: 200 }
    );
  }

  const body = (await req.json()) as J0Callback;
  if (body.status.id !== 3) {
    const message = body.message ? Buffer.from(body.message, "base64") : "";
    const stderr = body.stderr ? Buffer.from(body.stderr, "base64") : "";
    const compile_output = body.compile_output
      ? Buffer.from(body.compile_output, "base64")
      : "";
    const stdout = body.stdout ? Buffer.from(body.stdout, "base64") : "";
    const details = `<p>Failed in test case ${testNumber} ${
      body.status.description
    }</p>
    <p>Message: ${message}</p><p>Error: ${stderr}</p>
    <p>Compile Output: ${compile_output}</p>
    <p>Standard Output: ${stdout}</p>
    <p>Memory: ${body.memory / 1024} MB</p>`;
    await prisma.submission.update({
      where: {
        id: submissionId,
      },
      data: {
        verdict:
          body.status.id == 4 ? Verdict.WRONG_ANSWER : Verdict.RUNTIME_ERROR,
        details,
      },
    });
    return Response.json(
      { details: `Failed in test case ${testNumber}` },
      { status: 200 }
    );
  } else {
    await prisma.submission.update({
      where: {
        id: submissionId,
      },
      data: {
        details: `Running test case ${testNumber + 1}...`,
      },
    });
  }

  await requestJudge0(testNumber, submissionId);
  return Response.json({ details: "Request sent" }, { status: 200 });
};

// const encoder = new TextEncoder();

// export const POST = async (req: Request) => {
//   const body = await req.json();

//   const session = await auth();
//   const user = await prisma.user.findUnique({
//     where: {
//       email: session!.user!.email!,
//     },
//   });

//   const validation = submissionSchema.safeParse(body);
//   if (!validation.success) {
//     throw new Error("Invalid data");
//   }
//   const { problemId, language, code, contestId } = validation.data;
//   const problem = await prisma.problem.findUnique({
//     where: {
//       id: problemId,
//     },
//   });
//   if (!problem) {
//     throw new Error("Problem not found");
//   }

//   const testCases = await prisma.testCase.findMany({
//     where: {
//       problemId,
//     },
//   });
//   if (testCases.length === 0) {
//     throw new Error("No test cases found");
//   }

//   const readable = new ReadableStream({
//     async start(controller) {
//       controller.enqueue(encoder.encode(Verdict.PENDING));
//       await new Promise((resolve) => setTimeout(resolve, 100));
//       let verdict: Verdict = Verdict.PENDING,
//         details = "Failed to run";
//       for (let i = 0; i < testCases.length; i++) {
//         controller.enqueue(encoder.encode("Running test case " + (i + 1)));
//         const testCase = testCases[i];
//         const res = await processTestCase(language, code, problem, testCase);
//         if (res.status_id === 3) {
//           verdict = Verdict.ACCEPTED;
//         } else if (res.status_id === 4) {
//           verdict = Verdict.WRONG_ANSWER;
//           details = "Wrong Answer on test case " + (i + 1);
//         } else if (res.status_id === 5) {
//           verdict = Verdict.TIME_LIMIT_EXCEEDED;
//           details = "Time Limit Exceeded on test case " + (i + 1);
//         } else if (res.status_id === 6) {
//           verdict = Verdict.COMPILATION_ERROR;
//           details = `Compilation Error on test case ${i + 1}:\n ${res.stderr}`;
//         } else {
//           verdict = Verdict.RUNTIME_ERROR;
//           details = `Runtime Error on test case ${i + 1}:\n ${res.stderr}`;
//         }
//       }

//       await prisma.submission.create({
//         data: {
//           language,
//           code,
//           problemId,
//           contestId,
//           userId: user!.id,
//           verdict,
//           details,
//         },
//       });
//       controller.close();
//     },
//   });
//   return new Response(readable);
// };

// const processTestCase = async (
//   language: Language,
//   code: string,
//   problem: Problem,
//   testCase: TestCase
// ): Promise<{ stdout: string; stderr: string; status_id: number }> => {
//   const JUDGE0_KEY = process.env.JUDGE0_AUTH_KEY;
//   const JUDGE0_URL = process.env.JUDGE0_URL;
//   const body = JSON.stringify({
//     language_id: LANGUAGE_MAP[language],
//     source_code: code,
//     stdin: testCase.input,
//     expected_output: testCase.output,
//     cpu_time_limit: problem.timeLimit,
//     memory_limit: problem.memoryLimit,
//   });

//   const submissionId = (
//     await (
//       await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Auth-User": JUDGE0_KEY!,
//         },
//         body,
//       })
//     ).json()
//   ).token;
//   const submissionUrl = `${JUDGE0_URL}/submissions/${submissionId}?fields=stdout,stderr,status_id`;
//   let tryCount = 0;
//   while (tryCount < 10) {
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     const submissionRes = await fetch(submissionUrl, {
//       headers: {
//         "X-Auth-User": JUDGE0_KEY!,
//       },
//       cache: "no-store",
//     });
//     const submissionData = await submissionRes.json();
//     const status = submissionData.status_id;
//     if (status === 3) {
//       return submissionData;
//     } else if (status > 3) {
//       return submissionData;
//     }
//     tryCount++;
//   }
//   return { stdout: "", stderr: "", status_id: 0 };
// };
