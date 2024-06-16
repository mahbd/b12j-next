"use client";

import { ProblemFormData, problemSchema } from "./problemSchema";
import { createOrUpdateProblem } from "./actions";
import { Problem } from "@prisma/client";
import useFormComponents from "@/components/useFormComponents";

interface Props {
  problem?: Problem;
  redirectUrl?: string;
}

const ProblemForm = ({ problem, redirectUrl }: Props) => {
  const {
    Input,
    CodeEditor,
    Editor,
    CheckBox,
    SubmitBtn,
    handleSubmit,
    setIsSubmitting,
  } = useFormComponents<ProblemFormData>(problemSchema, {
    correctCode: problem?.correctCode || "",
    description: problem?.description,
    isHidden: problem?.isHidden || false,
    input: problem?.input,
    memoryLimit: problem?.memoryLimit || 262144,
    output: problem?.output,
    timeLimit: problem?.timeLimit || 1,
    title: problem?.title,
  });

  const doSubmit = async (data: ProblemFormData) => {
    setIsSubmitting(true);
    const res = await createOrUpdateProblem(JSON.stringify(data), problem?.id);
    setIsSubmitting(false);
    if (res.ok) {
      if (redirectUrl) window.location.href = redirectUrl;
      else window.location.href = "/problems";
    } else {
      alert("Error creating Problem");
    }
  };

  return (
    <form
      className="horizontal-center max-w-2xl m-5"
      onSubmit={handleSubmit(doSubmit)}
    >
      <Input name="title" />
      <CheckBox name="isHidden" label="Listed in public problem set" />
      <Editor name="description" />
      <Editor name="input" />
      <Editor name="output" />
      <CodeEditor name="correctCode" />
      <Input name="timeLimit" type="number" />
      <Input name="memoryLimit" type="number" />
      <SubmitBtn label={problem ? "Update Problem" : "Create Problem"} />
    </form>
  );
};

export default ProblemForm;
