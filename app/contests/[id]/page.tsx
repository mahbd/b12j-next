import authOptions from "@/auth/authOptions";
import { readableDateTime } from "@/app/components/helpers";
import prisma from "@/prisma/client";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

const Contest = async ({ params: { id } }: Props) => {
  const session = await getServerSession(authOptions);
  const contest = await prisma.contest.findUnique({
    where: { id: id },
    include: {
      contestProblems: { include: { problem: true } },
      contestWriters: { include: { user: true } },
      contestTesters: { include: { user: true } },
    },
  });
  if (!contest) {
    notFound();
  }

  const isWriter =
    (session &&
      session.user &&
      contest.contestWriters.some(
        (contestWriter) => contestWriter.user.email === session.user!.email
      )) ||
    // @ts-ignore
    (session && session.user && session.user.role === Role.ADMIN);

  return (
    <div className="w-full">
      {isWriter && (
        <Link className="btn btn-sm btn-primary" href={`/contests/${id}/edit`}>
          Edit
        </Link>
      )}
      <h1>{contest.title}</h1>
      <h2>Description</h2>
      <div
        dangerouslySetInnerHTML={{
          __html: contest.description || "<h2>No description</h2>",
        }}
      />
      <h2>Writers</h2>
      <ul>
        {contest.contestWriters.map((contestWriter) => (
          <li key={contestWriter.id}>{contestWriter.user.email}</li>
        ))}
      </ul>
      <h2>Testers</h2>
      <ul>
        {contest.contestTesters.map((contestTester) => (
          <li key={contestTester.id}>{contestTester.user.email}</li>
        ))}
      </ul>
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
