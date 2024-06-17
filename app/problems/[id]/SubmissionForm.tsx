"use client";

import { SubmissionFormData, submissionSchema } from "./submissionSchema";
import { Language } from "@prisma/client";
import { createSubmission } from "./submissionActions";
import useFormComponents from "@/components/useFormComponents";

interface Props {
  problemId: string;
  contestId?: string;
}

const SubmissionForm = ({ problemId, contestId }: Props) => {
  const {
    CodeEditor,
    Select,
    SubmitBtn,

    getValues,
    handleSubmit,
    setIsSubmitting,
  } = useFormComponents<SubmissionFormData>(submissionSchema, {
    problemId: problemId,
    contestId: contestId,
    language: Language.C_CPP,
  });

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
      <Select
        name="language"
        items={[
          {
            value: Language.C_CPP,
            label: "C/C++",
          },
          {
            value: Language.PYTHON3,
            label: "Python 3",
          },
        ]}
      />
      <CodeEditor
        name="code"
        language={getValues("language") === Language.C_CPP ? "c_cpp" : "python"}
      />
      <SubmitBtn label="Submit" />
    </form>
  );
};

export default SubmissionForm;
