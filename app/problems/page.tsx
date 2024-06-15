import prisma from "@/prisma/client";
import { Problem } from "@prisma/client";
import Link from "next/link";

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
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <div className="horizontal-center max-w-2xl w-full">
      <div className="card w-full bg-base-100 shadow-xl mt-5">
        <div className="card-body">
          <p className="card-title text-sm">Problem set</p>
          <ProblemsTable problems={problems} />
        </div>
      </div>
    </div>
  );
};

interface ExtendedProblem extends Problem {
  user: {
    name: string | null;
  };
}

const ProblemsTable = async ({
  problems,
}: {
  problems: ExtendedProblem[] | undefined;
}) => {
  if (!problems || problems.length === 0) {
    return <div>No Problems</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Problem Title</th>
            <th>Author</th>
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
              <td>{problem.user.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProblemsPage;

export async function generateMetadata() {
  return {
    title: "Problems",
    description: "View all problems",
  };
}
