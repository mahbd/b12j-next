import prisma from "@/prisma/client";
import ModifySubmissions from "./ModifySubmissions";
import Pagination from "@/components/Pagination";

interface Props {
  searchParams?: {
    offset: string;
    limit: string;
  };
}

const SubmissionsPage = async ({ searchParams }: Props) => {
  const itemCount = await prisma.submission.count({
    orderBy: { createdAt: "desc" },
  });
  const submissions = await prisma.submission.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, problem: true },
    take: searchParams?.limit ? parseInt(searchParams.limit) : 10,
    skip: searchParams?.offset ? parseInt(searchParams.offset) : 0,
  });
  return (
    <div>
      <p className="text-lg text-center font-bold mt-2 mb-5">Submissions</p>
      <ModifySubmissions submissions={submissions} />
      <Pagination
        itemCount={itemCount}
        limit={searchParams?.limit ? parseInt(searchParams.limit) : 10}
        offset={searchParams?.offset ? parseInt(searchParams.offset) : 0}
      />
    </div>
  );
};

export default SubmissionsPage;

export async function generateMetadata() {
  return {
    title: "Submissions",
  };
}
