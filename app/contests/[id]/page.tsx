import { auth } from "@/auth";
import prisma from "@/prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import { cache } from "react";
import StartCountDown from "./StartCountDown";
import { ContestProblem, Problem } from "@prisma/client";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface Props {
  params: { id: string };
}

const fetchContest = cache((id: string) =>
  prisma.contest.findUnique({
    where: { id: id },
    include: {
      problems: { include: { problem: true } },
    },
  })
);

const Contest = async ({ params: { id } }: Props) => {
  const session = await auth();
  const contest = await fetchContest(id);
  if (!contest) {
    notFound();
  }

  return (
    <div className="horizontal-center lg:max-w-2 xl w-full mx-5 md:mx-10 lg:mx-auto p-2">
      {session && session.user?.id === contest.userId && (
        <div className="flex justify-end mt-2">
          <Link
            className="btn btn-xs btn-primary"
            href={`/contests/${id}/edit`}
          >
            Edit
          </Link>
        </div>
      )}
      <h1 className="text-center mb-5">{contest.title}</h1>
      {contest.description && (
        <div className="prose">
          <Markdown rehypePlugins={[rehypeRaw]} disallowedElements={["script"]}>
            {contest.description}
          </Markdown>
        </div>
      )}

      {contest.startTime > new Date() && (
        <div className="both-center text-center mt-10">
          <p className="text-lg">Contest Starts in:</p>
          <StartCountDown startTime={contest.startTime} />
        </div>
      )}
      {contest.startTime <= new Date() && (
        <div>
          <div className="card w-full bg-base-100 shadow-xl mt-5">
            <div className="card-body">
              <p className="card-title text-sm">Problems</p>
              <ProblemTable contestProblems={contest.problems} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contest;

interface ExtendedContestProblem extends ContestProblem {
  problem: Problem;
}

const ProblemTable = async ({
  contestProblems,
}: {
  contestProblems: ExtendedContestProblem[] | undefined;
}) => {
  if (!contestProblems || contestProblems.length === 0) {
    return <div>No contests</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Start Time</th>
          </tr>
        </thead>
        <tbody>
          {contestProblems.map((contestProblem) => (
            <tr key={contestProblem.id}>
              <td>{contestProblem.problemIndex}</td>
              <td>
                <Link
                  className="link link-primary"
                  href={`/contests/${contestProblem.id}`}
                >
                  {contestProblem.problem.title}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const previousImages = (await parent).openGraph?.images || [];
  const contest = await fetchContest(id);

  return {
    title: contest?.title || "Contest not found",
    openGraph: {
      images: [...previousImages],
    },
  };
}
