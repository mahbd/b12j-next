import prisma from "@/prisma/client";
import ProblemForm from "./ProblemForm";

const NewProblemPage = async () => {
  return (
    <div className="w-full">
      <h1 className="text-center text-4xl">New Problem</h1>
      <ProblemForm />
    </div>
  );
};

export default NewProblemPage;
