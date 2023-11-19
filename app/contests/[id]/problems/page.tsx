import authOptions from "@/auth/authOptions";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import ContestProblemForm from "./ContestProblemForm";
import Link from "next/link";
import DeleteContestProblemButton from "./DeleteContestProblemButton";

interface Props {
  params: { id: string };
}

const ContestProblems = async ({ params: { id } }: Props) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    window.location.href = "/api/auth/signin";
    return;
  }
  const contest = await prisma.contest.findUnique({
    where: { id: id },
    include: {
      contestProblems: { include: { problem: { include: { user: true } } } },
    },
  });
  if (!contest) {
    notFound();
  }

  const availableProblems = await prisma.problem.findMany({
    where: {
      user: {
        email: session.user.email,
      },
    },
  });

  return (
    <div className="w-full lg:mr-16">
      <h1>Contest Problems</h1>
      <table>
        <thead>
          <tr>
            <th>Problem</th>
            <th>Writer</th>
            <th>Index</th>
          </tr>
        </thead>
        <tbody>
          {contest.contestProblems.map((contestProblem) => (
            <tr key={contestProblem.id}>
              <td>
                <Link
                  className="link link-primary"
                  href={`/problems/${contestProblem.problemId}`}
                >
                  {contestProblem.problem.title}
                </Link>
              </td>
              <td>{contestProblem.problem.user.email}</td>
              <td>{contestProblem.problemIndex}</td>
              <td>
                <DeleteContestProblemButton contestProblem={contestProblem} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ContestProblemForm problems={availableProblems} contestId={id} />
    </div>
  );
};

export default ContestProblems;
