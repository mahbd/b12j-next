import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import SubmissionForm from "./SubmissionForm";

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
    where: { problemId: problem.id },
    orderBy: { createdAt: "asc" },
    take: problem.exampleQuantity,
  });
  return (
    <div>
      <div className="text-center my-5">
        <h1>{problem.title}</h1>
        <p>Time Limit per test: {problem.timeLimit} second(s)</p>
        <p>Memory Limit per test: {problem.memoryLimit} megabytes</p>
      </div>
      <div dangerouslySetInnerHTML={{ __html: problem.description }} />
      <h2>Input</h2>
      <div dangerouslySetInnerHTML={{ __html: problem.inputTerms }} />
      <h2>Output</h2>
      <div dangerouslySetInnerHTML={{ __html: problem.outputTerms }} />
      <h2>Example</h2>
      {testCases.map((testCase) => (
        <div key={testCase.id}>
          <h3>Input</h3>
          <pre>{testCase.inputs}</pre>
          <h3>Output</h3>
          <pre>{testCase.outputs}</pre>
        </div>
      ))}
      <SubmissionForm problemId={id} contestId={searchParams?.contestId} />
    </div>
  );
};

export default page;
