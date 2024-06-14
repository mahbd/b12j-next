"use client";

import { ErrorMessage, Spinner, MDEditor } from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { contestSchema } from "./contestSchema";
import { createOrUpdateContest } from "./actions";
import { Contest } from "@prisma/client";
import { useState } from "react";

export type ContestFormData = z.infer<typeof contestSchema>;

const ContestForm = ({ contest }: { contest?: Contest }) => {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ContestFormData>({
    resolver: zodResolver(contestSchema),
    defaultValues: {
      title: contest?.title || "",
      description: contest?.description || "",
      // @ts-ignore
      startTime: formatDateToISOString(contest?.startTime || new Date()),
      // @ts-ignore
      endTime: formatDateToISOString(contest?.endTime || new Date()),
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const doSubmit = async (data: ContestFormData) => {
    const startTime = data.startTime;
    const endTime = data.endTime;
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
    <div className="flex justify-center align-middle">
      <form
        className="container max-w-2xl m-5"
        onSubmit={handleSubmit(doSubmit)}
      >
        <div className="form-control">
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            className={`input input-sm input-bordered ${
              errors.title ? "input-error" : ""
            }`}
            type="text"
            {...register("title")}
          />
          <ErrorMessage>{errors.title?.message}</ErrorMessage>
        </div>
        <div className="form-control">
          <label htmlFor="description">Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => {
              return (
                <MDEditor
                  name={field.name}
                  onChange={field.onChange}
                  value={field.value}
                />
              );
            }}
          />
          <ErrorMessage>{errors.description?.message}</ErrorMessage>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Start Time</span>
          </label>
          <input
            type="datetime-local"
            className={`input input-sm input-bordered ${
              errors.startTime ? "input-error" : ""
            }`}
            {...register("startTime", { valueAsDate: true })}
          />
          <ErrorMessage>{errors.startTime?.message}</ErrorMessage>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">End Time</span>
          </label>
          <input
            className={`input input-sm input-bordered ${
              errors.endTime ? "input-error" : ""
            }`}
            type="datetime-local"
            {...register("endTime", { valueAsDate: true })}
          />
          <ErrorMessage>{errors.endTime?.message}</ErrorMessage>
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-sm"
          disabled={isSubmitting}
        >
          {isSubmitting && <Spinner />} {contest ? "Update" : "Create"} Contest
        </button>
      </form>
    </div>
  );
};

export default ContestForm;

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
