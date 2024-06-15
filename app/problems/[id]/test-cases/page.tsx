import prisma from "@/prisma/client";
import Link from "next/link";
import React from "react";
import TestCaseDeleteButton from "./TestCaseDeleteButton";
import { isLogged, permissionOwnerStaff } from "@/components/helpers";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: { id: string };
}

const TestCases = async ({ params: { id: problemId } }: Props) => {
  const user = await isLogged(
    `/api/auth/signin?callbackUrl=/problems/${problemId}/test-cases`
  );
  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
  });
  if (!problem) {
    notFound();
  }
  if (!permissionOwnerStaff(user, problem)) {
    redirect("/denied");
  }

  const testCases = await prisma.testCase.findMany({
    include: { problem: true },
  });
  return (
    <div className="horizontal-center lg:max-w-4xl w-full mx-5 md:mx-10 lg:mx-auto p-2">
      <div className="flex justify-between">
        <h1 className="my-5">Test Cases</h1>
        <Link
          href={`/problems/${problemId}/test-cases/new`}
          className="btn btn-xs btn-primary my-5"
        >
          Add More
        </Link>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Problem</th>
            <th>Input</th>
            <th>Output</th>
          </tr>
        </thead>
        <tbody>
          {testCases.map((testCase) => (
            <tr key={testCase.id}>
              <td>
                <Link
                  className="link link-primary"
                  href={`/problems/${testCase.problem.id}`}
                >
                  {testCase.problem.title}
                </Link>
              </td>
              <td>
                <pre>{testCase.input}</pre>
              </td>
              <td>
                <pre>{testCase.output}</pre>
              </td>
              <td>
                <TestCaseDeleteButton testCaseId={testCase.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestCases;

export async function generateMetadata() {
  return {
    title: "Test Cases",
  };
}
