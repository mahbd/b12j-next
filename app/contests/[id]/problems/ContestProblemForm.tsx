"use client";

import { Problem } from "@prisma/client";
import { useState } from "react";
import { addProblemToContest } from "../../new/actions";
import { Spinner } from "@/components";

interface Props {
  problems: Problem[];
  contestId: string;
}

const ContestProblemForm = ({ problems, contestId }: Props) => {
  const [selectedProblem, setSelectedProblem] = useState("");
  const [problemIndex, setProblemIndex] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!problems || problems.length === 0) {
    return (
      <div>
        <p className="text-error">No problems found written by you.</p>
      </div>
    );
  }
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (selectedProblem === "") {
          alert("Please select a problem");
          return;
        }
        if (problemIndex === "") {
          alert("Please enter a problem index");
          return;
        }
        setIsSubmitting(true);
        const res = await addProblemToContest(
          contestId,
          selectedProblem,
          problemIndex
        );
        setIsSubmitting(false);
        if (res.ok) {
          alert("Problem added to contest successfully");
          window.location.reload();
        } else {
          alert(res.message || "Error adding problem to contest");
        }
      }}
    >
      <div className="form-control">
        <label htmlFor="">Problem Title</label>
        <select
          className="select select-sm select-primary select-bordered"
          value={selectedProblem}
          onChange={(e) => setSelectedProblem(e.target.value)}
        >
          <option value="">Select a problem</option>
          {problems.map((problem) => (
            <option key={problem.id} value={problem.id}>
              {problem.title}
            </option>
          ))}
        </select>
      </div>
      <div className="form-control">
        <label htmlFor="">Problem Index</label>
        <input
          className="input input-sm input-primary input-bordered"
          type="text"
          value={problemIndex}
          onChange={(e) => setProblemIndex(e.target.value)}
        />
      </div>
      <button
        className="btn btn-sm btn-primary"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting && <Spinner />} Add
      </button>
    </form>
  );
};

export default ContestProblemForm;
