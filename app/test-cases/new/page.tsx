"use client";

import { ErrorMessage, Spinner } from "@/app/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { generateOutput, createNewTestCase } from "../actions";
import { testCaseSchema } from "./testCaseSchema";
import { useState } from "react";

interface Props {
  searchParams?: {
    problemId: string;
  };
}

type CheckerFormData = z.infer<typeof testCaseSchema>;

const Checker = ({ searchParams }: Props) => {
  const problemId = searchParams?.problemId;

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<CheckerFormData>({
    resolver: zodResolver(testCaseSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!problemId) {
    return <div>Problem ID not set</div>;
  }

  return (
    <div className="w-full mx-2 lg:mx-32">
      <h1 className="text-center text-4xl">New Contest</h1>
      <form
        onSubmit={handleSubmit(async (data: CheckerFormData) => {
          setIsSubmitting(true);
          const res = await createNewTestCase(JSON.stringify(data), problemId);
          setIsSubmitting(false);
          if (res.ok) {
            alert("Checker created successfully");
            window.location.href = "/test-cases";
          } else {
            alert("Error creating checker");
          }
        })}
      >
        <div className="flex flex-col items-center">
          <div className="flex flex-col w-full">
            <label htmlFor="inputs">Inputs</label>
            <textarea
              id="inputs"
              className="border-2"
              {...register("inputs")}
            />
            <ErrorMessage>{errors.inputs?.message}</ErrorMessage>
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="outputs">Outputs</label>
            <textarea
              id="outputs"
              readOnly
              className="border-2"
              {...register("outputs")}
            />
            <ErrorMessage>{errors.outputs?.message}</ErrorMessage>
          </div>
          <div className="flex flex-row w-full justify-between">
            <button
              type="button"
              className="btn btn-success btn-sm border-2"
              disabled={isGenerating || isSubmitting}
              onClick={async () => {
                setIsGenerating(true);
                const res = await generateOutput(
                  getValues("inputs"),
                  problemId
                );
                setIsGenerating(false);
                setValue("outputs", res);
              }}
            >
              {isGenerating && <Spinner />} Generate Output
            </button>

            <button
              type="submit"
              className="btn btn-primary btn-sm border-2"
              disabled={isSubmitting || isGenerating}
            >
              {isSubmitting && <Spinner />} Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checker;
