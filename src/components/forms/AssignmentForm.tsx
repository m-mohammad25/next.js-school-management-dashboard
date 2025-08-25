"use client";

import { useEffect } from "react";

import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";

import InputField from "../InputField";

import {
  AssignmentFormInputsTypes,
  assignmentSchema,
} from "@/components/formsValidationSchemas";
import { createAssignment, updateAssignment } from "@/components/actions";

import { toast } from "react-toastify";

import { FormProps } from "./types";
import { formatDateTimeLocal } from "@/lib/helpers";

const AssignmentForm = ({
  type,
  data,
  setOpenModal,
  relatedData,
}: FormProps) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignmentFormInputsTypes>({
    resolver: zodResolver(assignmentSchema),
  });

  // AFTER REACT 19 IT'LL BE USEACTIONSTATE

  const [state, formAction] = useFormState(
    type === "create" ? createAssignment : updateAssignment,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((formData) => {
    formAction({ ...formData, id: data?.id });
  });

  useEffect(() => {
    if (state.success) {
      toast(
        `Assignment has been ${type === "create" ? "created" : "updated"}!`
      );
      setOpenModal(false);
      router.refresh();
    }
  }, [state, router, type, setOpenModal]);

  const { lessons } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Create a new assignment"
          : "Update the assignment"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Assignment title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title || state?.fieldErrors?.title?.[0]}
        />
        <InputField
          label="Start Date"
          name="startDate"
          defaultValue={formatDateTimeLocal(data?.startDate)}
          register={register}
          error={errors?.startDate || state?.fieldErrors?.startDate?.[0]}
          type="datetime-local"
        />
        <InputField
          label="End Date"
          name="dueDate"
          defaultValue={formatDateTimeLocal(data?.dueDate)}
          register={register}
          error={errors?.dueDate || state?.fieldErrors?.dueDate?.[0]}
          type="datetime-local"
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Lesson</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("lessonId")}
            defaultValue={data?.lessonId}
          >
            {lessons.map(
              (lesson: {
                id: number;
                subject: { name: string };
                class: { name: string };
              }) => (
                <option value={lesson.id} key={lesson.id}>
                  {`${lesson.subject.name} - ${lesson.class.name}`}
                </option>
              )
            )}
          </select>
          {errors.lessonId?.message && (
            <p className="text-xs text-red-400">
              {errors.lessonId.message.toString()}
            </p>
          )}
          {state?.fieldErrors?.lessonId?.[0] && (
            <p className="text-xs text-red-400">
              {state?.fieldErrors?.lessonId?.[0]}
            </p>
          )}
        </div>
      </div>
      {state?.message && <span className="text-red-500">{state?.message}</span>}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default AssignmentForm;
