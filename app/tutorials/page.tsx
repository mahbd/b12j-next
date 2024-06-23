import prisma from "@/prisma/client";
import { Metadata } from "next";
import Link from "next/link";

const TutorialsPage = async () => {
  const tutorials = await prisma.tutorial.findMany();
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Tutorial</th>
          </tr>
        </thead>
        <tbody>
          {tutorials.map((tutorial) => (
            <tr key={tutorial.id}>
              <td>
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
  );
};

export default TutorialsPage;

export const metadata: Metadata = {
  title: "Tutorials",
  description: "Tutorials for learning",
};
