import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import SubmissionForm from "./SubmissionForm";
import Link from "next/link";

interface Props {
  params: { id: string };
  searchParams?: {
    contestId: string;
  };
}

const page = async ({ params: { id }, searchParams }: Props) => {
  const problem = await prisma.problem.findUnique({
    where: { id },
  });
  if (!problem) {
    notFound();
  }
  const testCases = await prisma.testCase.findMany({
    where: { problemId: problem.id, isSample: true },
    orderBy: { createdAt: "asc" },
  });
  return (
    <div className="w-full">
      <Link href={`/test-cases/new?problemId=${id}`}>Add Test Case</Link>
      <div className="text-center my-5">
        <h1>{problem.title}</h1>
        <p>Time Limit per test: {problem.timeLimit} second(s)</p>
        <p>Memory Limit per test: {problem.memoryLimit} megabytes</p>
      </div>
      <div dangerouslySetInnerHTML={{ __html: problem.description }} />
      <h2>Input</h2>
      <div dangerouslySetInnerHTML={{ __html: problem.input }} />
      <h2>Output</h2>
      <div dangerouslySetInnerHTML={{ __html: problem.output }} />
      <h2>Example</h2>
      <table>
        <thead>
          <tr>
            <th>Input</th>
            <th>Output</th>
          </tr>
        </thead>
        <tbody>
          {testCases.map((testCase) => (
            <tr key={testCase.id}>
              <td>
                <pre>{testCase.input}</pre>
              </td>
              <td>
                <pre>{testCase.output}</pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <SubmissionForm problemId={id} contestId={searchParams?.contestId} />
    </div>
  );
};

export default page;
