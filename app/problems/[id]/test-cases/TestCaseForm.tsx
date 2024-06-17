"use client";

import { useState } from "react";
import { TestCaseFormData, testCaseSchema } from "./testCaseSchema";
import { createOrUpdateTestCase, generateOutput } from "./actions";
import { Spinner } from "@/components";
import useFormComponents from "@/components/useFormComponents";

interface Props {
  problemId: string;
  redirectUrl?: string;
}

const TestCaseForm = ({ problemId, redirectUrl }: Props) => {
  const {
    SubmitBtn,
    Textarea,
    getValues,
    setValue,
    handleSubmit,
    isSubmitting,
    setIsSubmitting,
  } = useFormComponents<TestCaseFormData>(testCaseSchema, {
    problemId: problemId,
  });

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
      <Textarea name="input" />
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
      <Textarea name="output" />
      {outputGenerated && <SubmitBtn label="Create Test Case" />}
    </form>
  );
};

export default TestCaseForm;
