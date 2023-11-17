"use client";

import { ErrorMessage, Spinner } from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { onSubmit } from "./actions";
import { redirect } from "next/navigation";
import { checkerSchema } from "./checkerSchema";

export type CheckerFormData = z.infer<typeof checkerSchema>;

const Checker = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckerFormData>({
    resolver: zodResolver(checkerSchema),
  });
  return (
    <div className="w-full mx-2 lg:mx-32">
      <h1 className="text-center text-4xl">New Contest</h1>
      <form
        onSubmit={handleSubmit(async (data: CheckerFormData) => {
          const res = await onSubmit(JSON.stringify(data));
          if (res.ok) {
            alert("Checker created successfully");
            window.location.href = "/checkers";
          } else {
            alert("Error creating checker");
          }
        })}
      >
        <div className="flex flex-col items-center">
          <div className="flex flex-col w-full">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              className="border-2"
              {...register("name")}
            />
            <ErrorMessage>{errors.name?.message}</ErrorMessage>
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="checkerId">Language</label>
            <select
              className="select select-bordered select-sm w-full"
              {...register("language")}
            >
              <option value="C_CPP">C/C++</option>
              <option value="PYTHON3">Python 3</option>
            </select>
            <ErrorMessage>{errors.language?.message}</ErrorMessage>
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="source">Source code</label>
            <textarea
              id="source"
              className="border-2"
              {...register("source")}
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
        </div>
      </form>
    </div>
  );
};

export default Checker;
