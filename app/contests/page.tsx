import prisma from "@/prisma/client";
import { Contest } from "@prisma/client";
import React from "react";
import { readableDateTime } from "@/components/helpers";
import Link from "next/link";

const ContestsPage = async () => {
  const upcoming_contests = await prisma.contest.findMany({
    where: {
      startTime: {
        gt: new Date(),
      },
    },
  });
  const past_contests = await prisma.contest.findMany({
    where: {
      startTime: {
        lte: new Date(),
      },
    },
  });
  return (
    <div className="horizontal-center max-w-2xl w-full">
      <div className="card w-full bg-base-100 shadow-xl mt-5">
        <div className="card-body">
          <p className="card-title text-sm">Current or Upcoming Contests</p>
          <ContestsCard contests={upcoming_contests} />
        </div>
      </div>
      <div className="card w-full bg-base-100 shadow-xl mt-5">
        <div className="card-body">
          <p className="card-title text-sm">Past Contests</p>
          <ContestsCard contests={past_contests} />
        </div>
      </div>
    </div>
  );
};

export default ContestsPage;

const ContestsCard = async ({
  contests,
}: {
  contests: Contest[] | undefined;
}) => {
  if (!contests || contests.length === 0) {
    return <div>No contests</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Start Time</th>
          </tr>
        </thead>
        <tbody>
          {contests.map((contest) => (
            <tr key={contest.id}>
              <td>
                <Link
                  className="link link-primary"
                  href={`/contests/${contest.id}`}
                >
                  {contest.title}
                </Link>
              </td>
              <td>{readableDateTime(contest.startTime.toISOString())}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
