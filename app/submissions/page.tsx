import prisma from "@/prisma/client";
import React from "react";
import { readableDateTime } from "@/components/helpers";
import Link from "next/link";
import Pagination from "@/components/Pagination";

interface Props {
  searchParams?: {
    offset: string;
    limit: string;
  };
}

const Submission = async ({ searchParams }: Props) => {
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
    <div>
      <h1 className="text-center">Submission List</h1>
      <table className="table table-md table-auto w-auto">
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
              <td>{submission.id}</td>
              <td>{readableDateTime(submission.createdAt.toISOString())}</td>
              <td>{submission.user.email}</td>
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
      <Pagination
        itemCount={itemCount}
        limit={searchParams?.limit ? parseInt(searchParams.limit) : 10}
        offset={searchParams?.offset ? parseInt(searchParams.offset) : 0}
      />
    </div>
  );
};

export default Submission;
