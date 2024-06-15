import prisma from "@/prisma/client";
import { notFound, redirect } from "next/navigation";
import SubmissionForm from "./SubmissionForm";
import Link from "next/link";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { auth } from "@/auth";
import { cache } from "react";

interface Props {
  params: { id: string };
  searchParams?: {
    contestId: string;
  };
}

const fetchProblem = cache((id: string) =>
  prisma.problem.findUnique({
    where: { id },
  })
);

const page = async ({ params: { id }, searchParams }: Props) => {
  const session = await auth();
  if (id === "new") {
    return redirect("/problems/new/edit");
  }
  const problem = await fetchProblem(id);
  if (!problem) {
    notFound();
  }
  const testCases = await prisma.testCase.findMany({
    where: { problemId: problem.id, isSample: true },
    orderBy: { createdAt: "asc" },
  });
  return (
    <div className="horizontal-center lg:max-w-4xl w-full mx-5 md:mx-10 lg:mx-auto p-2">
      {session && session.user?.id === problem.userId && (
        <div className="flex justify-end mt-2 gap-3">
          <Link
            className="btn btn-xs btn-primary"
            href={`/problems/${id}/edit`}
          >
            Edit
          </Link>
          <Link
            className="btn btn-xs btn-primary"
            href={`/problems/${id}/test-cases`}
          >
            Test Cases
          </Link>
        </div>
      )}
      <div className="text-center my-5">
        <h1>{problem.title}</h1>
        <p>Time Limit per test: {problem.timeLimit} second(s)</p>
        <p>Memory Limit per test: {problem.memoryLimit} megabytes</p>
      </div>
      <h2 className="text-lg">Description</h2>
      <div className="prose">
        <Markdown rehypePlugins={[rehypeRaw]} disallowedElements={["script"]}>
          {problem.description}
        </Markdown>
      </div>
      <h2 className="text-lg">Input</h2>
      <div className="prose">
        <Markdown rehypePlugins={[rehypeRaw]} disallowedElements={["script"]}>
          {problem.input}
        </Markdown>
      </div>
      <h2 className="text-lg">Output</h2>
      <div className="prose">
        <Markdown rehypePlugins={[rehypeRaw]} disallowedElements={["script"]}>
          {problem.output}
        </Markdown>
      </div>
      <h2 className="text-lg">Example</h2>
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

export const generateMetadata = async ({ params: { id } }: Props) => {
  const problem = await fetchProblem(id);
  return {
    title: problem?.title,
    description: problem?.description,
  };
};
