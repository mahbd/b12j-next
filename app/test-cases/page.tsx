import prisma from "@/prisma/client";
import Link from "next/link";
import React from "react";
import TestCaseDeleteButton from "./TestCaseDeleteButton";

const TestCases = async () => {
  const testCases = await prisma.testCase.findMany({
    include: { problem: true },
  });
  return (
    <div className="w-full">
      <h1>Test Cases</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Problem</th>
            <th>Input</th>
            <th>Output</th>
          </tr>
        </thead>
        <tbody>
          {testCases.map((testCase) => (
            <tr key={testCase.id}>
              <td>{testCase.id}</td>
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
