"use client";

import { CodeEditor, ErrorMessage, Spinner } from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import z from "zod";
import { onSolutionSubmission } from "./actions";
import { submissionSchema } from "./submissionSchema";
import { useState } from "react";
import { Language } from "@prisma/client";

export type SubmissionFormData = z.infer<typeof submissionSchema>;

interface Props {
  problemId: string;
  contestId?: string;
}

const SubmissionForm = ({ problemId, contestId }: Props) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      onSubmit={handleSubmit(async (data: SubmissionFormData) => {
        setIsSubmitting(true);
        const res = await onSolutionSubmission(
          JSON.stringify(data),
          problemId,
          contestId
        );
        setIsSubmitting(false);
        if (res.ok) {
          alert("Submitted successfully");
          window.location.href = "/submissions";
        } else {
          alert("Failed to submit");
        }
      })}
    >
      <div className="form-control">
        <label htmlFor="checkerId">Language</label>
        <select
          className="select select-bordered select-sm"
          {...register("language")}
        >
          <option value={Language.C_CPP}>C/C++</option>
          <option value={Language.PYTHON3}>Python 3</option>
        </select>
        <ErrorMessage>{errors.language?.message}</ErrorMessage>
      </div>
      <div className="form-control">
        <label htmlFor="code">Code</label>
        <Controller
          name="code"
          control={control}
          render={({ field }) => {
            return (
              <CodeEditor
                name={field.name}
                onChange={field.onChange}
                value={field.value}
              />
            );
          }}
        />
        <ErrorMessage>{errors.code?.message}</ErrorMessage>
      </div>
      <button
        type="submit"
        className="btn btn-primary btn-sm border-2"
        disabled={isSubmitting}
      >
        {isSubmitting && <Spinner />} Submit
      </button>
    </form>
  );
};

export default SubmissionForm;
