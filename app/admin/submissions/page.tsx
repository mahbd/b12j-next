import prisma from "@/prisma/client";
import ModifySubmissions from "./ModifySubmissions";

const SubmissionsPage = async () => {
  const submissions = await prisma.submission.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, problem: true },
  });
  return <ModifySubmissions submissions={submissions} />;
};

export default SubmissionsPage;

export async function generateMetadata() {
  return {
    title: "Submissions",
  };
}
