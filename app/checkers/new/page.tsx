"use client";

import { CodeEditor, ErrorMessage, Spinner } from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import z from "zod";
import { onSubmit } from "./actions";
import { checkerSchema } from "./checkerSchema";
import { useState } from "react";
import { Language } from "@prisma/client";

export type CheckerFormData = z.infer<typeof checkerSchema>;

const Checker = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CheckerFormData>({
    resolver: zodResolver(checkerSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="w-full mx-2 lg:mx-32">
      <h1 className="text-center text-4xl">New Checker</h1>
      <form
        onSubmit={handleSubmit(async (data: CheckerFormData) => {
          setIsSubmitting(true);
          const res = await onSubmit(JSON.stringify(data));
          setIsSubmitting(false);
          if (res.ok) {
            alert("Checker created successfully");
            window.location.href = "/checkers";
          } else {
            alert("Error creating checker");
          }
        })}
      >
        <div className="form-control">
          <label htmlFor="title">Name</label>
          <input
            type="text"
            id="title"
            className="input input-sm input-bordered"
            {...register("name")}
          />
          <ErrorMessage>{errors.name?.message}</ErrorMessage>
        </div>
        <div className="form-control">
          <label htmlFor="checkerId">Language</label>
          <select
            className="select select-bordered select-sm"
            {...register("language")}
          >
            <option value={Language.JAVASCRIPT}>JavaScript</option>
            {/* <option value="C_CPP">C/C++</option>
            <option value="PYTHON3">Python 3</option> */}
          </select>
          <ErrorMessage>{errors.language?.message}</ErrorMessage>
        </div>
        <div className="form-control">
          <label htmlFor="source">Source code</label>
          <Controller
            name="source"
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
          <ErrorMessage>{errors.source?.message}</ErrorMessage>
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-sm border-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner /> : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Checker;
