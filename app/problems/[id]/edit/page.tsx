import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import ProblemForm from "../../ProblemForm";

interface Props {
  params: { id: string };
}

const EditProblem = async ({ params: { id } }: Props) => {
  if (id === "new") {
    return (
      <div className="m-2 w-full">
        <h1 className="text-center text-4xl">New Problem</h1>
        <ProblemForm />
      </div>
    );
  }

  const problem = await prisma.problem.findUnique({
    where: { id: id },
  });
  if (!problem) {
    notFound();
  }

  return (
    <div className="m-2 w-full">
      <h1 className="text-center text-4xl">Update Problem</h1>
      <ProblemForm problem={problem} />
    </div>
  );
};

export default EditProblem;

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: id == "new" ? "New Problem" : "Update Problem",
    openGraph: {
      images: [...previousImages],
    },
  };
}
