import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import ContestForm from "../../new/ContestForm";

interface Props {
  params: { id: string };
}

const EditContest = async ({ params: { id } }: Props) => {
  const contest = await prisma.contest.findUnique({
    where: { id: id },
  });
  if (!contest) {
    notFound();
  }

  return <ContestForm contest={contest} />;
};

export default EditContest;
