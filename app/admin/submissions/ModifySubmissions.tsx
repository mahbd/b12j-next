"use client";

import {
  judgeBatchSubmissions,
  batchDeleteSubmissions,
} from "@/app/submissions/submissionActions";
import { Spinner } from "@/components";
import { readableDateTime } from "@/components/helpers";
import { Problem, Submission, User } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";

interface ExtendedSubmission extends Submission {
  user: User;
  problem: Problem;
}

interface Props {
  submissions: ExtendedSubmission[];
}

const ModifySubmissions = ({ submissions }: Props) => {
  const [selectedItems, setSelectedItems] = useState(new Set<string>());
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (itemId: string) => {
    setSelectedItems((prevSet) => {
      const newSet = new Set(prevSet);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const toggleAll = () => {
    if (selectedItems.size === submissions.length) {
      setSelectedItems(new Set<string>());
      return;
    }
    const newSet = new Set<string>();
    submissions.forEach((submission) => {
      newSet.add(submission.id);
    });
    setSelectedItems(newSet);
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-start">
        <button
          className="btn btn-xs btn-primary me-3"
          disabled={selectedItems.size === 0 || loading}
          onClick={async () => {
            const areSure = confirm("Are you sure you want to rejudge?");
            setLoading(true);
            if (areSure) {
              const res = await judgeBatchSubmissions(
                Array.from(selectedItems)
              );
              if (res.ok) {
                window.location.reload();
              } else {
                alert("Failed to rejudge submissions");
              }
            }
            setLoading(false);
          }}
        >
          {loading && <Spinner />} Rejudge
        </button>
        <button
          className="btn btn-xs btn-error"
          disabled={selectedItems.size === 0 || loading}
          onClick={async () => {
            const areSure = confirm("Are you sure you want to delete?");
            setLoading(true);
            if (areSure) {
              await batchDeleteSubmissions(Array.from(selectedItems));
              window.location.reload();
            }
            setLoading(false);
          }}
        >
          {loading && <Spinner />} Delete
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>
              <input
                className="checkbox rounded-sm checkbox-xs checkbox-primary"
                type="checkbox"
                id="select-all"
                checked={selectedItems.size === submissions.length}
                onChange={toggleAll}
              />{" "}
              {selectedItems.size}/{submissions.length}
            </th>
            <th>Submission ID</th>
            <th>Time</th>
            <th>User</th>
            <th>Problem</th>
            <th>Language</th>
            <th>Verdict</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id}>
              <td>
                <input
                  className="checkbox rounded-sm checkbox-xs checkbox-primary me-3"
                  type="checkbox"
                  id={`item-${submission.id}`}
                  checked={selectedItems.has(submission.id)}
                  onChange={() => handleCheckboxChange(submission.id)}
                />
              </td>
              <td>
                <Link
                  className="link link-primary"
                  href={`/submissions/${submission.id}`}
                >
                  {submission.id.slice(0, 8)}
                </Link>
              </td>
              <td>{readableDateTime(submission.createdAt.toISOString())}</td>
              <td>{submission.user.name}</td>
              <td>
                <Link
                  className="link link-primary"
                  href={`/problems/${submission.problemId}`}
                >
                  {submission.problem.title}
                </Link>
              </td>
              <td>{submission.language}</td>
              <td>{submission.verdict}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ModifySubmissions;
