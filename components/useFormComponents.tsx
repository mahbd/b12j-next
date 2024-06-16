"use client";

import {
  Controller,
  DefaultValues,
  FieldValues,
  Path,
  useForm,
} from "react-hook-form";
import ErrorMessage from "./ErrorMessage";
import { ReactNode, useState } from "react";
import { MDEditor, Spinner } from ".";
import { ZodObject } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const reformatString = (str: string) => {
  str = str.replace(/([A-Z])/g, " $1").trim();
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const useFormComponents = <T extends FieldValues>(
  resolver: ZodObject<FieldValues>,
  defaultValues?: DefaultValues<T>
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<T>({ resolver: zodResolver(resolver), defaultValues });

  interface InputProps {
    name: Path<T>;
    label?: string | null;
    placeholder?: string;
    type?: "text" | "datetime-local";
  }

  const Input = ({ name, label, placeholder, type }: InputProps) => (
    <div className="form-control">
      {label !== null && (
        <label className="label">
          <span className="label-text">
            {label ? label : reformatString(name)}
          </span>
        </label>
      )}
      <input
        className={`input input-sm input-bordered ${
          errors[name] ? "input-error" : ""
        }`}
        type={type || "text"}
        placeholder={placeholder}
        {...register(name, { valueAsDate: type === "datetime-local" })}
      />
      <ErrorMessage>{errors[name]?.message as ReactNode}</ErrorMessage>
    </div>
  );

  interface SelectProps {
    name: Path<T>;
    items: { [key: string]: any }[];
    valueKey?: string;
    labelKey?: string;
  }

  const Select = ({ name, items, valueKey, labelKey }: SelectProps) => (
    <div className="form-control w-full">
      <select
        className="select select-sm select-bordered ms-2"
        {...register(name)}
      >
        <option value={""}>Select a {reformatString(name)}</option>
        {items.map((item) => (
          <option
            key={item[valueKey || "value"]}
            value={item[valueKey || "value"]}
          >
            {item[labelKey || "label"]}
          </option>
        ))}
      </select>
      <ErrorMessage>{errors[name]?.message as ReactNode}</ErrorMessage>
    </div>
  );

  interface EditorProps {
    name: Path<T>;
    label?: string | null;
  }

  const Editor = ({ name, label }: EditorProps) => (
    <div className="form-control">
      {label !== null && (
        <label className="label">
          <span className="label-text">
            {label ? label : reformatString(name)}
          </span>
        </label>
      )}
      <Controller
        name={name}
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
      <ErrorMessage>{errors[name]?.message as ReactNode}</ErrorMessage>
    </div>
  );

  const SubmitBtn = ({ label }: { label: string }) => (
    <div className="flex justify-center">
      <button
        type="submit"
        className="btn btn-primary btn-sm my-5"
        disabled={isSubmitting}
      >
        {isSubmitting && <Spinner />} {label}
      </button>
    </div>
  );
  return {
    Input,
    Select,
    SubmitBtn,
    Editor,
    control,
    handleSubmit,
    setError,
    setIsSubmitting,
  };
};

export default useFormComponents;
