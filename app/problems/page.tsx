import Pagination from "@/components/Pagination";
import prisma from "@/prisma/client";
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
      <div className="flex flex-col justify-center overflow-x-auto gap-2">
        <table className="table table-md table-auto w-auto border-2">
          <thead>
            <tr className="border-2">
              <th>Problem</th>
              <th>Difficulty</th>
            </tr>
          </thead>
          {problems.map((problem) => (
            <tbody>
              <tr className="border-2">
                <td>{problem.title}</td>
                <td>{problem.difficulty}</td>
              </tr>
            </tbody>
          ))}
        </table>
        <Pagination itemCount={itemCount} limit={limit} offset={offset} />
      </div>
    </div>
  );
};

export default ProblemsPage;
