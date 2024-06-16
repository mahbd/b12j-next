"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { TestCaseFormData, testCaseSchema } from "./testCaseSchema";
import { createOrUpdateTestCase, generateOutput } from "./actions";
import { ErrorMessage, Spinner } from "@/components";

interface Props {
  problemId: string;
  redirectUrl?: string;
}

const TestCaseForm = ({ problemId, redirectUrl }: Props) => {
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<TestCaseFormData>({
    resolver: zodResolver(testCaseSchema),
    defaultValues: {
      problemId: problemId,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [outputGenerated, setOutputGenerated] = useState(false);

  const doSubmit = async (data: TestCaseFormData) => {
    setIsSubmitting(true);
    const res = await createOrUpdateTestCase(JSON.stringify(data));
    setIsSubmitting(false);
    if (res.ok) {
      if (redirectUrl) window.location.href = redirectUrl;
      else window.location.href = "/testCases";
    } else {
      alert("Error creating TestCase");
    }
  };

  return (
    <form
      className="horizontal-center lg:max-w-2xl w-full mx-5 md:mx-10 lg:mx-auto p-2"
      onSubmit={handleSubmit(doSubmit)}
    >
      <div className="form-control">
        <label className="label">
          <span className="label-text">Input</span>
        </label>
        <textarea
          className={`textarea textarea-bordered ${
            errors.input ? "textarea-error" : ""
          }`}
          {...register("input")}
        />
        <ErrorMessage>{errors.input?.message}</ErrorMessage>
      </div>
      <button
        className="btn btn-sm btn-primary my-3"
        onClick={async () => {
          setIsSubmitting(true);
          const input = getValues("input");
          const res = await generateOutput(input, problemId);
          setValue("output", res.message);
          if (res.ok) {
            setOutputGenerated(true);
          }
          setIsSubmitting(false);
        }}
        type="button"
        disabled={isSubmitting}
      >
        {isSubmitting && <Spinner />} Generate Output
      </button>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Output</span>
        </label>
        <textarea
          className={`textarea textarea-bordered ${
            errors.input ? "textarea-error" : ""
          }`}
          {...register("output")}
        />
        <ErrorMessage>{errors.output?.message}</ErrorMessage>
      </div>
      {outputGenerated && (
        <button
          type="submit"
          className="btn btn-primary btn-sm my-5"
          disabled={isSubmitting}
        >
          {isSubmitting && <Spinner />} Create TestCase
        </button>
      )}
    </form>
  );
};

export default TestCaseForm;
