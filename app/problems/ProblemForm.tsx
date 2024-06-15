"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ProblemFormData, problemSchema } from "./problemSchema";
import { createOrUpdateProblem } from "./actions";
import { Language, Problem } from "@prisma/client";
import { Controller, useForm } from "react-hook-form";
import { CodeEditor, ErrorMessage, Spinner, MDEditor } from "@/components";
import { useState } from "react";

interface Props {
  problem?: Problem;
}

const ProblemForm = ({ problem }: Props) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProblemFormData>({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      correctCode: problem?.correctCode || "",
      description: problem?.description,
      isHidden: problem?.isHidden || false,
      input: problem?.input,
      memoryLimit: problem?.memoryLimit || 262144,
      output: problem?.output,
      timeLimit: problem?.timeLimit || 1,
      title: problem?.title,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const doSubmit = async (data: ProblemFormData) => {
    setIsSubmitting(true);
    const res = await createOrUpdateProblem(JSON.stringify(data), problem?.id);
    setIsSubmitting(false);
    if (res.ok) {
      alert("Problem created successfully");
      window.location.href = "/problems";
    } else {
      alert("Error creating Problem");
    }
  };

  return (
    <form
      className="horizontal-center max-w-2xl m-5"
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
      <div className="flex">
        <label className="label">
          <input
            className="checkbox rounded-sm checkbox-sm checkbox-primary me-3"
            type="checkbox"
            {...register("isHidden")}
          />
          Listed in public problem set
        </label>
        <ErrorMessage>{errors.isHidden?.message}</ErrorMessage>
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
        <label htmlFor="description">Input</label>
        <Controller
          name="input"
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
        <ErrorMessage>{errors.input?.message}</ErrorMessage>
      </div>
      <div className="form-control">
        <label htmlFor="description">Output</label>
        <Controller
          name="output"
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
        <ErrorMessage>{errors.output?.message}</ErrorMessage>
      </div>
      <div className="w-full">
        <label htmlFor="correctCode">Correct Code</label>
        <Controller
          name="correctCode"
          control={control}
          render={({ field }) => {
            return (
              <CodeEditor
                language="c_cpp"
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
        <label className="label">
          <span className="label-text">Time Limit</span>
        </label>
        <input
          className={`input input-sm input-bordered ${
            errors.timeLimit ? "input-error" : ""
          }`}
          type="number"
          {...register("timeLimit", { valueAsNumber: true })}
        />
        <ErrorMessage>{errors.timeLimit?.message}</ErrorMessage>
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Memory Limit</span>
        </label>
        <input
          className={`input input-sm input-bordered ${
            errors.memoryLimit ? "input-error" : ""
          }`}
          type="number"
          {...register("memoryLimit", { valueAsNumber: true })}
        />
        <ErrorMessage>{errors.memoryLimit?.message}</ErrorMessage>
      </div>
      <button
        type="submit"
        className="btn btn-primary btn-sm my-5"
        disabled={isSubmitting}
      >
        {isSubmitting && <Spinner />} {problem ? "Update" : "Create"} Problem
      </button>
    </form>
  );
};

export default ProblemForm;
