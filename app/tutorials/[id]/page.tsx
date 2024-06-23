import prisma from "@/prisma/client";
import { Metadata } from "next";
import { cache } from "react";

interface Props {
  params: { id: string };
}

const fetchTutorial = cache((id: string) =>
  prisma.tutorial.findUnique({
    where: { id: id },
  })
);

const TutorialPage = async () => {
  return (
    <div>
      <h1>Working on it</h1>
    </div>
  );
};

export default TutorialPage;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tutorial = await fetchTutorial(params.id);
  return {
    title: tutorial?.title || "Tutorial not found",
    description: tutorial?.description || "No description found",
  };
}
