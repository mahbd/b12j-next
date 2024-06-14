import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import ContestForm from "../../ContestForm";
import { Metadata, ResolvingMetadata } from "next";

interface Props {
  params: { id: string };
}

const EditContest = async ({ params: { id } }: Props) => {
  if (id === "new") {
    return (
      <div className="m-2 w-full">
        <h1 className="text-center text-4xl">New Contest</h1>
        <ContestForm />
      </div>
    );
  }

  const contest = await prisma.contest.findUnique({
    where: { id: id },
  });
  if (!contest) {
    notFound();
  }

  return (
    <div className="m-2 w-full">
      <h1 className="text-center text-4xl">Update Contest</h1>
      <ContestForm contest={contest} />
    </div>
  );
};

export default EditContest;

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: id == "new" ? "New Contest" : "Update Contest",
    openGraph: {
      images: [...previousImages],
    },
  };
}
