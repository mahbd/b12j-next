import prisma from "@/prisma/client";
import TutorialForm from "../TutorialForm";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Props {
  params: { id: string };
}

const EditTutorial = async ({ params: { id } }: Props) => {
  const contests = await prisma.contest.findMany({
    select: { id: true, title: true },
  });
  const problems = await prisma.problem.findMany({
    select: { id: true, title: true },
  });
  if (id === "new") {
    return (
      <div className="m-2 w-full">
        <h1 className="text-center text-4xl">New Tutorial</h1>
        <TutorialForm contests={contests} problems={problems} />
      </div>
    );
  }

  const tutorial = await prisma.tutorial.findUnique({
    where: { id: id },
  });
  if (!tutorial) {
    notFound();
  }
  return (
    <div className="m-2 w-full">
      <h1 className="text-center text-4xl">Update Tutorial</h1>
      <TutorialForm
        tutorial={tutorial}
        contests={contests}
        problems={problems}
      />
    </div>
  );
};

export default EditTutorial;

export const metadata: Metadata = {
  title: "Update Tutorial",
  description: "Update a tutorial",
};
