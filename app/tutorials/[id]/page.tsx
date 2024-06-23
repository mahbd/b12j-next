import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface Props {
  params: { id: string };
}

const fetchTutorial = cache((id: string) =>
  prisma.tutorial.findUnique({
    where: { id: id },
    include: { user: true },
  })
);

const TutorialPage = async ({ params }: Props) => {
  const session = await auth();
  const tutorial = await fetchTutorial(params.id);
  if (!tutorial) {
    notFound();
  }
  return (
    <div>
      {session && session.user?.id === tutorial.userId && (
        <div className="flex justify-end mt-2">
          <Link
            className="btn btn-xs btn-primary"
            href={`/tutorials/${params.id}/edit`}
          >
            Edit
          </Link>
        </div>
      )}
      <h1 className="text-center">{tutorial.title}</h1>
      <p className="text-center mb-5">By {tutorial.user.name}</p>
      {tutorial.description && (
        <div className="prose">
          <Markdown rehypePlugins={[rehypeRaw]} disallowedElements={["script"]}>
            {tutorial.description}
          </Markdown>
        </div>
      )}
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
