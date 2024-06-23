import prisma from "@/prisma/client";
import React from "react";
import { readableDateTime } from "@/components/helpers";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import { Problem, Submission, User } from "@prisma/client";

interface Props {
  searchParams?: {
    offset: string;
    limit: string;
  };
}

const SubmissionsPage = async ({ searchParams }: Props) => {
  const itemCount = await prisma.submission.count({
    orderBy: { createdAt: "desc" },
  });
  const submissions = await prisma.submission.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, problem: true },
    take: searchParams?.limit ? parseInt(searchParams.limit) : 10,
    skip: searchParams?.offset ? parseInt(searchParams.offset) : 0,
  });
  return (
    <div className="mt-2">
      <p className="text-lg text-center font-bold mb-5">Submissions</p>
      <SubmissionsTable submissions={submissions} />
      <div className="ms-5">
        <Pagination
          itemCount={itemCount}
          limit={searchParams?.limit ? parseInt(searchParams.limit) : 10}
          offset={searchParams?.offset ? parseInt(searchParams.offset) : 0}
        />
      </div>
    </div>
  );
};

interface ExtendedSubmission extends Submission {
  user: User;
  problem: Problem;
}

const SubmissionsTable = async ({
  submissions,
}: {
  submissions: ExtendedSubmission[] | undefined;
}) => {
  if (!submissions || submissions.length === 0) {
    return <div>No Submissions</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Submission ID</th>
            <th>Time</th>
            <th>User</th>
            <th>Problem</th>
            <th>Language</th>
            <th>Verdict</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id}>
              <td>
                <Link
                  className="link link-primary"
                  href={`/submissions/${submission.id}`}
                >
                  {submission.id.slice(0, 8)}
                </Link>
              </td>
              <td>{readableDateTime(submission.createdAt.toISOString())}</td>
              <td>{submission.user.name}</td>
              <td>
                <Link
                  className="link link-primary"
                  href={`/problems/${submission.problemId}`}
                >
                  {submission.problem.title}
                </Link>
              </td>
              <td>{submission.language}</td>
              <td>{submission.verdict}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionsPage;
