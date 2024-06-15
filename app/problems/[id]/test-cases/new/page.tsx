import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import TestCaseForm from "../TestCaseForm";
import { Metadata, ResolvingMetadata } from "next";

interface Props {
  params: { id: string };
}

const AddTestCase = async ({ params: { id: problemId } }: Props) => {
  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
  });
  if (!problem) {
    notFound();
  }

  return (
    <div className="m-2 w-full">
      <h1 className="text-center text-4xl">Update Contest</h1>
      <TestCaseForm
        problemId={problemId}
        redirectUrl={`/problems/${problemId}/test-cases`}
      />
    </div>
  );
};

export default AddTestCase;

export async function generateMetadata(
  parent: ResolvingMetadata
): Promise<Metadata> {
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: "New TestCase",
    openGraph: {
      images: [...previousImages],
    },
  };
}
