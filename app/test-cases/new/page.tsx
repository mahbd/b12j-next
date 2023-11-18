"use client";

import { ErrorMessage, Spinner } from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { generateOutput, onSubmit } from "./actions";
import { testCaseSchema } from "./testCaseSchema";
import { useState } from "react";

export type CheckerFormData = z.infer<typeof testCaseSchema>;

const Checker = () => {
  const problemId = "fkl_djs_akl_fkl_dsf_kkl";
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

  return (
    <div className="w-full mx-2 lg:mx-32">
      <h1 className="text-center text-4xl">New Contest</h1>
      <form
        onSubmit={handleSubmit(async (data: CheckerFormData) => {
          setIsSubmitting(true);
          const res = await onSubmit(JSON.stringify(data), problemId);
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
          <button
            type="button"
            className="btn btn-success btn-sm border-2"
            disabled={isGenerating}
            onClick={async () => {
              setIsGenerating(true);
              const res = await generateOutput(getValues("inputs"), problemId);
              setIsGenerating(false);
              setValue("outputs", res);
            }}
          >
            {isGenerating ? <Spinner /> : "Generate Output"}
          </button>

          <button
            type="submit"
            className="btn btn-primary btn-sm border-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner /> : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checker;
