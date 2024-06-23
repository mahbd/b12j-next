"use client";

import { Tutorial } from "@prisma/client";
import { TutorialFormData, tutorialSchema } from "./tutorialSchema";
import { createOrUpdateTutorial } from "./actions";
import useFormComponents from "@/components/useFormComponents";

interface Props {
  tutorial?: Tutorial;
  contests: { id: string; title: string }[];
  problems: { id: string; title: string }[];
}

const TutorialForm = ({ tutorial, contests, problems }: Props) => {
  const {
    CheckBox,
    Input,
    Select,
    Editor,
    SubmitBtn,
    handleSubmit,
    setIsSubmitting,
  } = useFormComponents<TutorialFormData>(tutorialSchema, {
    contestId: tutorial?.contestId || undefined,
    description: tutorial?.description || "",
    isHidden: tutorial?.isHidden || true,
    problemId: tutorial?.problemId || undefined,
    title: tutorial?.title || "",
  });

  const doSubmit = async (data: TutorialFormData) => {
    setIsSubmitting(true);
    try {
      const res = await createOrUpdateTutorial(
        JSON.stringify(data),
        tutorial?.id
      );
      if (res.ok) {
        window.location.href = `/tutorials`;
      }
    } catch (error) {
      console.error(error);
    }
    setIsSubmitting(false);
  };
  return (
    <form onSubmit={handleSubmit(doSubmit)} className="gap-5">
      <Input name="title" />
      <CheckBox name="isHidden" label="Hidden" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Select
          name="contestId"
          label="Contest"
          labelKey="title"
          valueKey="id"
          items={contests}
        />
        <Select
          name="problemId"
          label="Problem"
          labelKey="title"
          valueKey="id"
          items={problems}
        />
      </div>
      <Editor name="description" />
      <SubmitBtn label={tutorial ? "Update" : "Create"} />
    </form>
  );
};

export default TutorialForm;
