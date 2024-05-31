"use client";

import { ErrorMessage, Spinner, TextEditor } from "@/app/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { contestSchema } from "./schema";
import { createOrUpdateContest } from "./actions";
import { Contest } from "@prisma/client";
import { useEffect, useState } from "react";

export type ContestFormData = z.infer<typeof contestSchema>;

const ContestForm = ({ contest }: { contest?: Contest }) => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
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

  return (
    <form
      onSubmit={handleSubmit(async (data: ContestFormData) => {
        setIsSubmitting(true);
        const res = await createOrUpdateContest(
          JSON.stringify(data),
          contest?.id
        );
        setIsSubmitting(false);
        if (res.ok) {
          alert("Contest created successfully");
          window.location.href = "/contests";
        } else {
          alert("Error creating contest");
        }
      })}
    >
      <div className="form-control">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          className="input input-sm input-bordered"
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
              <TextEditor
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
        <label htmlFor="startTime">Start Time</label>
        <input
          type="datetime-local"
          id="startTime"
          className="input input-sm input-bordered"
          {...register("startTime", { valueAsDate: true })}
        />
        <ErrorMessage>{errors.startTime?.message}</ErrorMessage>
      </div>
      <div className="form-control">
        <label htmlFor="endTime">End Time</label>
        <input
          type="datetime-local"
          id="endTime"
          className="input input-sm input-bordered"
          {...register("endTime")}
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
