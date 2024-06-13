"use client";

import { ContestProblem } from "@prisma/client";
import { useState } from "react";
import { removeProblemFromContest } from "../../new/actions";
import { Spinner } from "@/components";

const DeleteContestProblemButton = ({
  contestProblem,
}: {
  contestProblem: ContestProblem;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  return (
    <button
      className="btn btn-xs btn-error"
      onClick={async () => {
        setIsDeleting(true);
        const res = await removeProblemFromContest(contestProblem);
        setIsDeleting(false);
        if (res.ok) {
          alert("Problem removed from contest successfully");
          window.location.reload();
        } else {
          alert("Error removing problem from contest");
        }
      }}
      disabled={isDeleting}
    >
      {isDeleting && <Spinner />} Delete
    </button>
  );
};

export default DeleteContestProblemButton;
