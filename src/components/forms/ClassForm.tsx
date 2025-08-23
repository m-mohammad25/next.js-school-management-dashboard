"use client";
import { useEffect } from "react";

import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { ClassFormInputsTypes, classSchema } from "../formsValidationSchemas";

import { toast } from "react-toastify";

import { createClass, updateClass } from "../actions";

import InputField from "@/components/InputField";
import { FormProps } from "./types";

function SubjectForm({ setOpenModal, type, data, relatedData }: FormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassFormInputsTypes>({
    resolver: zodResolver(classSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createClass : updateClass,
    {
      success: false,
      error: false,
    }
  );

  useEffect(() => {
    if (state.success) {
      toast(`Class has been ${type}d sucessfully!`);
      setOpenModal(false);
      router.refresh();
    }
  }, [state, setOpenModal, router, toast]);

  const onSubmit = handleSubmit((formData) => {
    formAction({ ...formData, id: data?.id });
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">
        {type === "create" ? `Create a new class` : "Update class"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Class Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name || state?.fieldErrors?.name?.[0]}
        />

        <InputField
          label="Capacity"
          name="capacity"
          defaultValue={data?.capacity}
          register={register}
          error={errors?.capacity || state?.fieldErrors?.capacity?.[0]}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="supervisor" className="text-xs text-gray-500 gap-0">
            supervisor
          </label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("supervisorId")}
            defaultValue={data?.supervisorId}
          >
            {relatedData.teachers.map(
              (teacher: { id: string; name: string; surname: string }) => (
                <option
                  selected={data?.supervisorId === teacher.id}
                  value={teacher.id}
                  key={teacher.id}
                >{`${teacher.name} ${teacher.surname}`}</option>
              )
            )}
          </select>
          {errors?.supervisorId?.message && (
            <p className="text-xs text-red-400">
              {errors.supervisorId?.message}
            </p>
          )}
          {state?.fieldErrors?.supervisorId?.[0] && (
            <p className="text-xs text-red-400">
              {state?.fieldErrors?.supervisorId?.[0]}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="grade" className="text-xs text-gray-500 gap-0">
            grade
          </label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("gradeId")}
            defaultValue={data?.gradeId}
          >
            {relatedData.grades.map((grade: { id: number; level: number }) => (
              <option
                selected={data?.gradeId === grade.id}
                value={grade.id}
                key={grade.id}
              >{`${grade.level}`}</option>
            ))}
          </select>
          {errors.gradeId?.message && (
            <p className="text-xs text-red-400">{errors.gradeId?.message}</p>
          )}
          {state?.fieldErrors?.gradeId?.[0] && (
            <p className="text-xs text-red-400">
              {state?.fieldErrors?.gradeId?.[0]}
            </p>
          )}
        </div>
      </div>
      {state?.message && <span className="text-red-500">{state?.message}</span>}

      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "create" : "update"}
      </button>
    </form>
  );
}

export default SubjectForm;
