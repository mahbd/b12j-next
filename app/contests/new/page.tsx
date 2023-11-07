"use client";

import { ErrorMessage, TextEditor } from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { contestSchema } from "./schema";
import { onSubmit } from "./actions";
import { redirect } from "next/navigation";

export type ContestFormData = z.infer<typeof contestSchema>;

const ContestForm = () => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContestFormData>({
    resolver: zodResolver(contestSchema),
  });

  return (
    <div>
      <h1 className="text-center text-4xl">New Contest</h1>
      <form
        onSubmit={handleSubmit(async (data: ContestFormData) => {
          const res = await onSubmit(JSON.stringify(data));
          if (res.ok) {
            alert("Contest created successfully");
            redirect("/contests");
          } else {
            alert("Error creating contest");
          }
        })}
      >
        <div className="flex flex-col items-center">
          <div className="flex flex-col w-1/2">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              className="border-2"
              {...register("title")}
            />
            <ErrorMessage>{errors.title?.message}</ErrorMessage>
          </div>
          <div className="prose flex flex-col w-1/2">
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
          <div className="flex flex-col w-1/2">
            <label htmlFor="startTime">Start Time</label>
            <input
              type="datetime-local"
              id="startTime"
              className="border-2"
              {...register("startTime")}
            />
            <ErrorMessage>{errors.startTime?.message}</ErrorMessage>
          </div>
          <div className="flex flex-col w-1/2">
            <label htmlFor="endTime">End Time</label>
            <input
              type="datetime-local"
              id="endTime"
              className="border-2"
              {...register("endTime")}
            />
            <ErrorMessage>{errors.endTime?.message}</ErrorMessage>
          </div>
          <button type="submit" className="border-2" disabled={isSubmitting}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContestForm;
