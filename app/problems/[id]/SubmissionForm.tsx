"use client";

import { AceEditor, ErrorMessage, Spinner } from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import z from "zod";
import { submissionSchema } from "./submissionSchema";
import { useEffect, useState } from "react";
import { Language } from "@prisma/client";
import { createSubmission } from "./submissionActions";

const decoder = new TextDecoder();

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
    getValues,
    formState: { errors },
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      problemId: problemId,
      contestId: contestId,
      language: Language.C_CPP,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      onSubmit={handleSubmit(async (data: SubmissionFormData) => {
        setIsSubmitting(true);
        const res = await createSubmission(JSON.stringify(data));
        if (!res.ok) {
          alert(res.message);
        } else {
          window.location.href = "/submissions";
        }
        setIsSubmitting(false);
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
              <AceEditor
                language={
                  getValues("language") === Language.C_CPP ? "c_cpp" : "python"
                }
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
        className="btn btn-primary btn-sm border-2 mb-32"
        disabled={isSubmitting}
      >
        {isSubmitting && <Spinner />} Submit
      </button>
    </form>
  );
};

export default SubmissionForm;
