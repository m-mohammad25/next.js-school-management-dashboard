"use client";

import { useEffect, useState } from "react";

import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";

import InputField from "../InputField";

import {
  LessonFormInputsTypes,
  lessonSchema,
} from "@/components/formsValidationSchemas";
import { createLesson, updateLesson } from "@/components/actions";

import { toast } from "react-toastify";

import { FormProps } from "./types";

const LessonForm = ({ type, data, setOpenModal, relatedData }: FormProps) => {
  const [subjectTeachers, setSubjectTeachers] = useState<
    { id: string; name: string }[]
  >([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonFormInputsTypes>({
    resolver: zodResolver(lessonSchema),
  });

  // AFTER REACT 19 IT'LL BE USEACTIONSTATE

  const [state, formAction] = useFormState(
    type === "create" ? createLesson : updateLesson,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((formData) => {
    console.log(formData);
    formAction({ ...formData, id: data?.id });
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submit event triggered");
    onSubmit(e);
  };

  useEffect(() => {
    if (state.success) {
      toast(`Lesson has been ${type === "create" ? "created" : "updated"}!`);
      setOpenModal(false);
      router.refresh();
    }
  }, [state, router, type, setOpenModal]);

  const { subjects } = relatedData;

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSubject = subjects.find(
      (subject: { id: number }) => subject.id === +e.target.value
    );
    const subjectTeachers = selectedSubject.teachers.map(
      (t: { id: string; name: string; surname: string }) => ({
        id: t.id,
        name: t.name + " " + t.surname,
      })
    );

    setSubjectTeachers(subjectTeachers);
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={handleFormSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new lesson" : "Update the lesson"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Subject</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("subjectId")}
            defaultValue={data?.subjectId}
            onChange={handleSubjectChange}
          >
            {subjects.map((subject: { id: number; name: string }) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          {errors.subjectId?.message && (
            <p className="text-xs text-red-400">
              {errors.subjectId.message.toString()}
            </p>
          )}
          {state?.fieldErrors?.subjectId?.[0] && (
            <p className="text-xs text-red-400">
              {state?.fieldErrors?.subjectId?.[0]}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Teacher</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("teacherId")}
            defaultValue={data?.teacherId}
          >
            {subjectTeachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
          {errors.teacherId?.message && (
            <p className="text-xs text-red-400">
              {errors.teacherId.message.toString()}
            </p>
          )}
          {state?.fieldErrors?.teacherId?.[0] && (
            <p className="text-xs text-red-400">
              {state?.fieldErrors?.teacherId?.[0]}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classId")}
            defaultValue={data?.classId}
          >
            {relatedData.classes.map(
              (classItem: { id: number; name: string }) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </option>
              )
            )}
          </select>
          {errors.teacherId?.message && (
            <p className="text-xs text-red-400">
              {errors.teacherId.message.toString()}
            </p>
          )}
          {state?.fieldErrors?.teacherId?.[0] && (
            <p className="text-xs text-red-400">
              {state?.fieldErrors?.teacherId?.[0]}
            </p>
          )}
        </div>

        <InputField
          label="Start Date"
          name="startTime"
          defaultValue={data?.startTime}
          register={register}
          error={errors?.startTime || state?.fieldErrors?.startTime?.[0]}
          type="time"
        />
        <InputField
          label="End Date"
          name="endTime"
          defaultValue={data?.endTime}
          register={register}
          error={errors?.endTime || state?.fieldErrors?.endTime?.[0]}
          type="time"
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Day</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("day")}
            defaultValue={data?.day}
          >
            <option>MONDAY</option> <option>TUESDAY</option>
            <option>WEDNESDAY</option>
            <option>THURSDAY</option>
            <option>FRIDAY</option>
          </select>
          {errors.day?.message && (
            <p className="text-xs text-red-400">
              {errors.day.message.toString()}
            </p>
          )}
          {state?.fieldErrors?.day?.[0] && (
            <p className="text-xs text-red-400">
              {state?.fieldErrors?.day?.[0]}
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

export default LessonForm;
