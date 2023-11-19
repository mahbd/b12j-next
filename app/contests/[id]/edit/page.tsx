import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import ContestForm from "../../new/ContestForm";
import Link from "next/link";

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

  return (
    <div>
      <Link className="link link-primary" href={`/contests/${id}/problems`}>
        Add or Remove Contest Problems
      </Link>
      <ContestForm contest={contest} />
    </div>
  );
};

export default EditContest;
