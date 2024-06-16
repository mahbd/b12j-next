import { readableDateTime } from "@/components/helpers";
import prisma from "@/prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

const SubmissionPage = async ({ params }: Props) => {
  const submission = await prisma.submission.findUnique({
    where: { id: params.id },
    include: { user: true, problem: true },
  });

  if (!submission) {
    notFound();
  }

  return (
    <div className="horizontal-center lg:max-w-4xl w-full mx-5 md:mx-10 lg:mx-auto p-2">
      <div className="card w-full bg-base-100 shadow-xl mt-5">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div>
              <p className="font-bold text-lg">Problem</p>
              <Link
                className="link link-primary"
                href={`/problems/${submission.problemId}`}
              >
                <p>{submission.problem.title}</p>
              </Link>
            </div>
            <div>
              <p className="font-bold text-lg">Verdict</p>
              <p>{submission.verdict}</p>
            </div>
            <div>
              <p className="font-bold text-lg">Time</p>
              <p>{readableDateTime(submission.createdAt.toISOString())}</p>
            </div>
            <div>
              <p className="font-bold text-lg">User</p>
              <p>{submission.user.name}</p>
            </div>
          </div>
          <p className="font-bold text-lg">Code</p>
          <pre className="bg-base-200 rounded-xl p-2">{submission.code}</pre>
          <p className="font-bold text-lg">Details</p>
          <div
            className="bg-base-200 rounded-xl p-2"
            dangerouslySetInnerHTML={{
              __html: submission.details || <p>No details found.</p>,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SubmissionPage;
