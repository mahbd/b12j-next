"use client";

import { useState } from "react";
import { deleteTestCase } from "./actions";
import { Spinner } from "@/components";

interface Props {
  testCaseId: string;
}

const TestCaseDeleteButton = ({ testCaseId }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  return (
    <button
      className="btn btn-xs btn-error"
      onClick={async () => {
        setIsDeleting(true);
        const res = await deleteTestCase(testCaseId);
        setIsDeleting(false);
        if (res.ok) {
          location.reload();
        }
      }}
      disabled={isDeleting}
    >
      {isDeleting && <Spinner />} Delete
    </button>
  );
};

export default TestCaseDeleteButton;
