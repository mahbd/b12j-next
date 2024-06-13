"use client";

import { CodeEditor, ErrorMessage, Spinner } from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import z from "zod";
import { submissionSchema } from "./submissionSchema";
import { useEffect, useState } from "react";
import { Language } from "@prisma/client";

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
  const [verdict, setVerdict] = useState("");

  return (
    <form
      onSubmit={handleSubmit(async (data: SubmissionFormData) => {
        setIsSubmitting(true);
        const reader = (
          await fetch("/api/submissions", {
            method: "POST",
            body: JSON.stringify(data),
          })
        ).body?.getReader();
        while (true) {
          const { done, value } = await reader!.read();
          if (done) {
            window.location.href = `/submissions`;
            break;
          }
          const text = decoder.decode(value);
          setVerdict(text);
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
      {verdict && (
        <div className="form-control">
          <label htmlFor="verdict">Verdict</label>
          <input
            type="text"
            className="input input-bordered"
            value={verdict}
            readOnly
          />
        </div>
      )}
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
