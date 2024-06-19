import ChangeTheme from "@/components/ChangeTheme";
import { isLogged } from "@/components/helpers";
import prisma from "@/prisma/client";
import Link from "next/link";

const ProfilePage = async () => {
  const user = await isLogged("/profile");
  const problems = await prisma.problem.findMany({
    where: {
      userId: user.id,
    },
  });
  const tutorials = await prisma.tutorial.findMany({
    where: {
      userId: user.id,
    },
  });
  const contests = await prisma.contest.findMany({
    where: {
      userId: user.id,
      moderators: {
        some: {
          userId: user.id,
        },
      },
    },
  });

  return (
    <div className="horizontal-center lg:max-w-4xl w-full mx-5 md:mx-10 lg:mx-auto p-2">
      <ChangeTheme />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mt-2">
        <Link href={"/contests/new/edit"} className="btn btn-sm btn-primary">
          Start Contest
        </Link>
        <Link href={"/problems/new/edit"} className="btn btn-sm btn-primary">
          Create Problem
        </Link>
        <Link href={"/tutorials/new/edit"} className="btn btn-sm btn-primary">
          Create Tutorial
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        <div className="overflow-x-auto border-2 rounded-lg">
          <p className="text-lg m-2">Problems</p>
          <table className="table">
            <tbody>
              {problems.map((problem) => (
                <tr key={problem.id}>
                  <td className="border-2">
                    <Link
                      className="link link-primary"
                      href={`/problems/${problem.id}`}
                    >
                      {problem.title}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto border-2 rounded-lg">
          <p className="text-lg m-2">Tutorials</p>
          <table className="table">
            <tbody>
              {tutorials.map((tutorial) => (
                <tr key={tutorial.id}>
                  <td className="border-2">
                    <Link
                      className="link link-primary"
                      href={`/tutorials/${tutorial.id}`}
                    >
                      {tutorial.title}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto border-2 rounded-lg">
          <p className="text-lg m-2">Contests</p>
          <table className="table">
            <tbody>
              {contests.map((contest) => (
                <tr key={contest.id}>
                  <td className="border-2">
                    <Link
                      className="link link-primary"
                      href={`/contests/${contest.id}`}
                    >
                      {contest.title}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

export const metadata = {
  title: "Profile",
  description: "Profile page",
};
