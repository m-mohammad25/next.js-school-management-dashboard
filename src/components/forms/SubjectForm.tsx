"use client";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";

import InputField from "@/components/InputField";
import { createSubject, updateSubject } from "../actions";
import {
  SubjectFormInputsTypes,
  subjectSchema,
} from "../formsValidationSchemas";

import { toast } from "react-toastify";
import { FormProps } from "./types";

function SubjectForm({ setOpenModal, type, data, relatedData }: FormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectFormInputsTypes>({
    resolver: zodResolver(subjectSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createSubject : updateSubject,
    {
      success: false,
      error: false,
    }
  );

  useEffect(() => {
    if (state.success) {
      toast(`Subject has been ${type}d sucessfully!`);
      setOpenModal(false);
      router.refresh();
    }
  }, [state, toast, setOpenModal, router]);

  const onSubmit = handleSubmit((formData) => {
    formAction({ ...formData, id: data?.id });
  });

  const subjectTeachers = data?.teachers?.map(
    (teacher: { id: string }) => teacher.id
  );

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">
        {type === "create" ? `Create a new subject` : "Update Subject"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Subject Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name || state?.fieldErrors?.name?.[0]}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="teachers" className="text-xs text-gray-500 gap-0">
            teachers
          </label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("teachers")}
            defaultValue={subjectTeachers}
          >
            {relatedData.teachers.map(
              (teacher: { id: string; name: string; surname: string }) => (
                <option
                  value={teacher.id}
                  key={teacher.id}
                >{`${teacher.name} ${teacher.surname}`}</option>
              )
            )}
          </select>
          {errors.teachers?.message && (
            <p className="text-xs text-red-400">{errors.teachers?.message}</p>
          )}
          {state?.fieldErrors?.teachers?.[0] && (
            <p className="text-xs text-red-400">
              {state?.fieldErrors?.teachers?.[0]}
            </p>
          )}
        </div>
      </div>
      {state?.message && <span className="text-red-500">{state.message}</span>}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "create" : "update"}
      </button>
    </form>
  );
}

export default SubjectForm;
