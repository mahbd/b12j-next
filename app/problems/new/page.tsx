import prisma from "@/prisma/client";
import ProblemForm from "./ProblemForm";

const NewProblemPage = async () => {
  const checkers = await prisma.checker.findMany();
  return (
    <div>
      <h1 className="text-center text-4xl">New Problem</h1>
      <ProblemForm checkers={checkers} />
    </div>
  );
};

export default NewProblemPage;
