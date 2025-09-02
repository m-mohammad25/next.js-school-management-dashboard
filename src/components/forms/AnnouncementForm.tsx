"use client";

import { useEffect } from "react";

import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";

import InputField from "../InputField";

import {
  AnnouncementFormInputsTypes,
  announcementSchema,
} from "@/components/formsValidationSchemas";
import { createAnnouncement, updateAnnouncement } from "@/components/actions";

import { toast } from "react-toastify";

import { FormProps } from "./types";
import { formatDateTimeLocal } from "@/lib/helpers";

const EventForm = ({ type, data, setOpenModal, relatedData }: FormProps) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnnouncementFormInputsTypes>({
    resolver: zodResolver(announcementSchema),
  });

  // AFTER REACT 19 IT'LL BE USEACTIONSTATE

  const [state, formAction] = useFormState(
    type === "create" ? createAnnouncement : updateAnnouncement,
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
        `Annoucement has been ${type === "create" ? "created" : "updated"}!`
      );
      setOpenModal(false);
      router.refresh();
    }
  }, [state, router, type, setOpenModal]);

  const { classes } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Create a new announcement"
          : "Update the announcement"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Event title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title || state?.fieldErrors?.title?.[0]}
        />

        <InputField
          label="Description"
          name="description"
          defaultValue={data?.description}
          register={register}
          error={errors?.description || state?.fieldErrors?.description?.[0]}
        />
        <InputField
          label="Date"
          name="date"
          defaultValue={formatDateTimeLocal(data?.date)}
          register={register}
          error={errors?.date || state?.fieldErrors?.data?.[0]}
          type="datetime-local"
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">For</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classId")}
            defaultValue={data?.classId}
          >
            <option value="">General</option>
            {classes.map((classItem: { id: number; name: string }) => (
              <option value={classItem.id} key={classItem.id}>
                {`${classItem.name}`}
              </option>
            ))}
          </select>
          {errors.classId?.message && (
            <p className="text-xs text-red-400">
              {errors.classId.message.toString()}
            </p>
          )}
          {state?.fieldErrors?.classId?.[0] && (
            <p className="text-xs text-red-400">
              {state?.fieldErrors?.classId?.[0]}
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

export default EventForm;
