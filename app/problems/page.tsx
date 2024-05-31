import Pagination from "@/app/components/Pagination";
import prisma from "@/prisma/client";
import Link from "next/link";
import React from "react";

interface Props {
  searchParams: {
    limit: string;
    offset: string;
  };
}

const ProblemsPage = async ({ searchParams }: Props) => {
  const limit = Number(searchParams.limit) || 10;
  const offset = Number(searchParams.offset) || 0;
  const problems = await prisma.problem.findMany({
    take: limit,
    skip: offset,
  });
  const itemCount = await prisma.problem.count();

  return (
    <div>
      <h1 className="text-center">Problem List</h1>
      <table className="table table-md table-auto w-auto">
        <thead>
          <tr>
            <th>Problem</th>
            <th>Status</th>
            <th>Difficulty</th>
            <th>Solve Count</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr key={problem.id}>
              <td>
                <Link
                  className="link link-primary"
                  href={`/problems/${problem.id}`}
                >
                  {problem.title}
                </Link>
              </td>
              <td>Solved</td>
              <td>{problem.difficulty}</td>
              <td>{problem.solveCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination itemCount={itemCount} limit={limit} offset={offset} />
    </div>
  );
};

export default ProblemsPage;
