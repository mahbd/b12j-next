"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ProblemFormData, problemSchema } from "./problemSchema";
import { onSubmit } from "./actions";
import { Language } from "@prisma/client";
import { Controller, useForm } from "react-hook-form";
import {
  CodeEditor,
  ErrorMessage,
  Spinner,
  TextEditor,
} from "@/app/components";
import { useState } from "react";

const ProblemForm = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProblemFormData>({
    resolver: zodResolver(problemSchema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      className="mx-2 lg:mx-32"
      onSubmit={handleSubmit(async (data: ProblemFormData) => {
        setIsSubmitting(true);
        const res = await onSubmit(JSON.stringify(data));
        setIsSubmitting(false);
        if (res.ok) {
          alert("Problem created successfully");
          window.location.href = "/problems";
        } else {
          alert("Error creating Problem");
        }
      })}
    >
      <div className="form-control">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          className="border-2 input input-sm input-bordered "
          {...register("title")}
        />
        <ErrorMessage>{errors.title?.message}</ErrorMessage>
      </div>
      <div className="w-full">
        <label htmlFor="correctCode">Correct Code</label>
        <Controller
          name="correctCode"
          control={control}
          render={({ field }) => {
            return (
              <CodeEditor
                name={field.name}
                onChange={field.onChange}
                value={field.value}
              />
            );
          }}
        />
        <ErrorMessage>{errors.correctCode?.message}</ErrorMessage>
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
      <div className="prose  w-full">
        <label htmlFor="description">Input</label>
        <Controller
          name="input"
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
        <ErrorMessage>{errors.input?.message}</ErrorMessage>
      </div>
      <div className="prose  w-full">
        <label htmlFor="description">Output</label>
        <Controller
          name="output"
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
        <ErrorMessage>{errors.output?.message}</ErrorMessage>
      </div>

      <button
        type="submit"
        className="btn btn-sm btn-primary border-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? <Spinner /> : "Submit"}
      </button>
    </form>
  );
};

export default ProblemForm;
