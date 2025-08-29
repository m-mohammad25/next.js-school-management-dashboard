"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ResultsFormInputsTypes,
  resultsSchema,
} from "@/components/formsValidationSchemas";
import { createResult, updateResult } from "@/components/actions";
import { toast } from "react-toastify";

import { FormProps } from "./types";
import InputField from "../InputField";

const ResultsForm = ({ type, data, setOpenModal, relatedData }: FormProps) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ResultsFormInputsTypes>({
    resolver: zodResolver(resultsSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createResult : updateResult,
    {
      success: false,
      error: false,
    }
  );

  const [students, setStudents] = useState<
    { id: string; name: string; surname: string }[]
  >([]);

  // Watch examId / assignmentId
  const selectedExamId = watch("examId");
  const selectedAssignmentId = watch("assignmentId");

  useEffect(() => {
    if (state.success) {
      toast(`Result has been ${type === "create" ? "created" : "updated"}!`);
      setOpenModal(false);
      router.refresh();
    }
  }, [state, router, type, setOpenModal]);

  // Fetch students dynamically
  useEffect(() => {
    const fetchStudents = async () => {
      let classId: number | null = null;

      if (selectedExamId) {
        const exam = relatedData.exams.find(
          (e: any) => e.id === Number(selectedExamId)
        );
        classId = exam?.lesson.class.id;
      } else if (selectedAssignmentId) {
        const assignment = relatedData.assignments.find(
          (a: any) => a.id === Number(selectedAssignmentId)
        );
        classId = assignment?.lesson.class.id;
      }

      if (classId) {
        const res = await fetch(`/api/students?classId=${classId}`);
        const studentsList = await res.json();
        setStudents(studentsList);
      } else {
        setStudents([]);
      }
    };

    fetchStudents();
  }, [selectedExamId, selectedAssignmentId, relatedData]);

  useEffect(() => {
    if (
      data?.studentId &&
      students.find((student) => student.id === data?.studentId)
    ) {
      setValue("studentId", data.studentId);
    } else {
      setValue("studentId", "");
    }
  }, [data?.studentId, students, setValue]);

  const onSubmit = handleSubmit((formData) => {
    formAction({ ...formData, id: data?.resultId });
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Create a new exam result"
          : "Update the exam result"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        {/* Exam selection */}
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Exam</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("examId")}
            defaultValue={data?.examId || ""}
            disabled={!!watch("assignmentId")}
          >
            <option value="">-- Select Exam --</option>
            {relatedData.exams.map((exam: any) => (
              <option value={exam.id} key={exam.id}>
                {`${exam.title} (${exam.lesson.subject.name} - ${exam.lesson.class.name})`}
              </option>
            ))}
          </select>
          {errors.examId?.message && (
            <p className="text-xs text-red-400">
              {errors.examId.message.toString()}
            </p>
          )}
        </div>

        {/* Assignment selection */}
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Assignment</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("assignmentId")}
            defaultValue={data?.assignmentId || ""}
            disabled={!!watch("examId")}
          >
            <option value="">-- Select Assignment --</option>
            {relatedData.assignments.map((assignment: any) => (
              <option value={assignment.id} key={assignment.id}>
                {`${assignment.title} (${assignment.lesson.subject.name} - ${assignment.lesson.class.name})`}
              </option>
            ))}
          </select>
          {errors.assignmentId?.message && (
            <p className="text-xs text-red-400">
              {errors.assignmentId.message.toString()}
            </p>
          )}
        </div>

        {/* Student selection */}
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Student</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("studentId")}
            defaultValue={data?.studentId || ""}
          >
            <option value="">-- Select Student --</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} {student.surname}
              </option>
            ))}
          </select>
          {errors.studentId?.message && (
            <p className="text-xs text-red-400">
              {errors.studentId.message.toString()}
            </p>
          )}
        </div>
        <InputField
          label="Score"
          name="score"
          defaultValue={data?.score ?? 0}
          register={register}
          error={errors?.score || state?.fieldErrors?.score?.[0]}
          type="number"
        />
      </div>

      {state?.message && <span className="text-red-500">{state?.message}</span>}

      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ResultsForm;
