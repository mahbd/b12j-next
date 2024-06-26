"use client";

import { Control, useFieldArray } from "react-hook-form";
import { ContestFormData, contestSchema } from "./contestSchema";
import { createOrUpdateContest } from "./actions";
import { Contest, ContestModerator, ContestProblem } from "@prisma/client";
import { FaPlus } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import useFormComponents from "@/components/useFormComponents";

interface ExtendedContest extends Contest {
  problems: ContestProblem[];
  moderators: ContestModerator[];
}

interface Props {
  contest?: ExtendedContest;
  problems: { id: string; title: string }[];
  users: { id: string; name: string | null }[];
}

const ContestForm = ({ contest, problems, users }: Props) => {
  const {
    Input,
    Select,
    Editor,
    SubmitBtn,
    control,
    handleSubmit,
    setError,
    setIsSubmitting,
  } = useFormComponents<ContestFormData>(contestSchema, {
    title: contest?.title || "",
    description: contest?.description || "",
    // @ts-ignore
    startTime: formatDateToISOString(contest?.startTime || new Date()),
    // @ts-ignore
    endTime: formatDateToISOString(contest?.endTime || new Date()),
    problems: contest?.problems || [],
    moderators: contest?.moderators || [],
  });

  const doSubmit = async (data: ContestFormData) => {
    const startTime = data.startTime;
    const endTime = data.endTime;
    if (!contest) {
      if (startTime < new Date()) {
        setError("startTime", {
          type: "manual",
          message: "Start time must be in the future",
        });
        return;
      }
      if (startTime >= endTime) {
        setError("endTime", {
          type: "manual",
          message: "End time must be after start time",
        });
        return;
      }
    }
    setIsSubmitting(true);
    const res = await createOrUpdateContest(JSON.stringify(data), contest?.id);
    setIsSubmitting(false);
    if (res.ok) {
      alert("Contest created successfully");
      window.location.href = "/contests";
    } else {
      alert("Error creating contest");
    }
  };

  return (
    <form
      className="horizontal-center lg:max-w-2xl w-full mx-5 md:mx-10 lg:mx-auto p-2"
      onSubmit={handleSubmit(doSubmit)}
    >
      <Input name="title" />
      <Editor name="description" />
      <Input name="startTime" type="datetime-local" />
      <Input name="endTime" type="datetime-local" />
      <ContestProblemForm
        control={control}
        Select={Select}
        Input={Input}
        problems={problems}
      />
      <ModeratorsForm control={control} Select={Select} users={users} />
      <SubmitBtn label={`${contest ? "Update" : "Create"} Contest`} />
    </form>
  );
};

export default ContestForm;

interface ConFormProps {
  control: Control<ContestFormData>;
  Select: any;
  Input: any;
  problems: { id: string; title: string }[];
}

const ContestProblemForm = ({
  control,
  Select,
  Input,
  problems,
}: ConFormProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "problems",
  });

  return (
    <div>
      <p className="font-bold text-lg mt-3">Select Problems</p>
      <ul>
        {fields.map((item, index) => (
          <div key={item.id} className="flex my-2">
            <Input
              name={`problems.${index}.problemIndex`}
              label={null}
              placeholder="Problem Index"
            />
            <Select
              name={`problems.${index}.problemId`}
              items={problems}
              label="Problem"
              valueKey="id"
              labelKey="title"
            />
            <button
              type="button"
              className={"btn btn-error btn-sm ms-2 px-3"}
              onClick={() => remove(index)}
            >
              <RiDeleteBin6Fill className="text-lg" />
            </button>
          </div>
        ))}
      </ul>
      <button
        type="button"
        className={"btn btn-sm btn-success mt-2"}
        onClick={() => append({ problemIndex: "", problemId: "" })}
      >
        <FaPlus className="mr-1" />
      </button>
    </div>
  );
};

interface ModFormProps {
  control: Control<ContestFormData>;
  Select: any;
  users: { id: string; name: string | null }[];
}

const ModeratorsForm = ({ control, Select, users }: ModFormProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "moderators",
  });

  return (
    <div>
      <p className="font-bold text-lg mt-3">Select Moderators</p>
      <ul>
        {fields.map((item, index) => (
          <div key={item.id} className="flex my-2">
            <Select
              name={`moderators.${index}.userId`}
              label={"Moderator"}
              items={users}
              valueKey="id"
              labelKey="name"
            />
            <button
              type="button"
              className={"btn btn-error btn-sm ms-2 px-3"}
              onClick={() => remove(index)}
            >
              <RiDeleteBin6Fill className="text-lg" />
            </button>
          </div>
        ))}
      </ul>
      <button
        type="button"
        className={"btn btn-sm btn-success mt-2"}
        onClick={() => append({ userId: "" })}
      >
        <FaPlus className="mr-1" />
      </button>
    </div>
  );
};

function formatDateToISOString(date: Date) {
  // Get the date in ISO format
  const isoString = date.toISOString();

  // Extract the date and time parts
  const datePart = isoString.slice(0, 10);
  const timePart = isoString.slice(11, 16);

  // Concatenate the date and time parts in the desired format
  const formattedDate = `${datePart}T${timePart}`;

  return formattedDate;
}
