import prisma from "@/prisma/client";
import { Contest } from "@prisma/client";
import React from "react";
import { readableDateTime } from "@/app/components/helpers";
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
    <div className="w-full">
      <h1>Current or Upcoming Contests</h1>
      <div className="flex flex-wrap">
        {upcoming_contests.map((contest) => (
          <ContestCard contest={contest} key={contest.id} />
        ))}
      </div>
      <h1>Past Contests</h1>
      <div className="flex flex-wrap">
        {past_contests.map((contest) => (
          <ContestCard contest={contest} key={contest.id} />
        ))}
      </div>
    </div>
  );
};

export default ContestsPage;

const ContestCard = async ({ contest }: { contest: Contest }) => {
  const contestTesters = await prisma.contestTester.findMany({
    where: {
      contestId: contest.id,
    },
  });
  const contestWriters = await prisma.contestWriter.findMany({
    where: {
      contestId: contest.id,
    },
  });
  return (
    <div
      className="card w-full bg-base-100 shadow-xl"
      style={{ maxWidth: "800px" }}
    >
      <div className="card-body card-bordered">
        <h2 className="card-title text-3xl link link-primary">
          <Link href={`/contests/${contest.id}`}>{contest.title}</Link>
        </h2>
        <div className="md:grid md:grid-cols-2">
          <div className="flex flex-col">
            <p className="font-bold">Writers</p>
            <p>
              {contestWriters.map((writer) => (
                <span key={writer.id}>{writer.userId}</span>
              ))}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="font-bold">Testers</p>
            <p>
              {contestTesters.map((tester) => (
                <span key={tester.id}>{tester.userId}</span>
              ))}
            </p>
          </div>
          <div className="flex">
            <p className="font-bold">Start Time</p>
            <p>{readableDateTime(contest.startTime.toISOString())}</p>
          </div>
          <div className="flex">
            <p className="font-bold">End Time</p>
            <p>{readableDateTime(contest.endTime.toISOString())}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
