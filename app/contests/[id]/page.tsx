import { readableDateTime } from "@/app/components/helpers";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

const Contest = async ({ params: { id } }: Props) => {
  const session = await auth();
  const contest = await prisma.contest.findUnique({
    where: { id: id },
    include: {
      contestProblems: { include: { problem: true } },
    },
  });
  if (!contest) {
    notFound();
  }

  return (
    <div className="w-full">
      <Link className="btn btn-sm btn-primary" href={`/contests/${id}/edit`}>
        Edit
      </Link>
      <h1>{contest.title}</h1>
      <h2>Description</h2>
      <div
        dangerouslySetInnerHTML={{
          __html: contest.description || "<h2>No description</h2>",
        }}
      />
      <h2>Start Time</h2>
      <p>{readableDateTime(contest.startTime.toISOString())}</p>
      <h2>End Time</h2>
      <p>{readableDateTime(contest.endTime.toISOString())}</p>
      <h2>Problems</h2>
      <ul>
        {contest.contestProblems.map((contestProblem) => (
          <li key={contestProblem.id}>
            <a href={`/problems/${contestProblem.problemId}`}>
              {contestProblem.problem.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contest;
