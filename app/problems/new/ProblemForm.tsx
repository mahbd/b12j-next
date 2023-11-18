"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ProblemFormData, problemSchema } from "./schema";
import { onSubmit } from "./actions";
import { Checker, Language } from "@prisma/client";
import { Controller, useForm } from "react-hook-form";
import { CodeEditor, ErrorMessage, Spinner, TextEditor } from "@/components";
import { redirect } from "next/navigation";
import { useState } from "react";

interface Props {
  checkers: Checker[] | undefined;
}

const ProblemForm = ({ checkers }: Props) => {
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
      <div className="form-control">
        <label htmlFor="checkerId">Select Checker</label>
        <select
          className="select select-bordered select-sm"
          {...register("checkerId")}
        >
          {checkers?.map((checker) => (
            <option value={checker.id} key={checker.id}>
              {checker.name}
            </option>
          ))}
        </select>
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
      <div className=" w-full">
        <label htmlFor="checkerId">Correct Language</label>
        <select
          className="select select-bordered select-sm w-full"
          {...register("correctLanguage")}
        >
          <option value={Language.C_CPP}>C/C++</option>
          <option value={Language.PYTHON3}>Python 3</option>
        </select>
        <ErrorMessage>{errors.correctLanguage?.message}</ErrorMessage>
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
          name="inputTerms"
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
        <ErrorMessage>{errors.inputTerms?.message}</ErrorMessage>
      </div>
      <div className="prose  w-full">
        <label htmlFor="description">Output</label>
        <Controller
          name="outputTerms"
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
        <ErrorMessage>{errors.outputTerms?.message}</ErrorMessage>
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
