"use client";

import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CldUploadWidget } from "next-cloudinary";

import InputField from "@/components/InputField";

import {
  TeacherFormInputsTypes,
  teacherSchema,
} from "../formsValidationSchemas";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createTeacher, updateTeacher } from "../actions";
import Image from "next/image";

type TeacherFormProps = {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  type: "update" | "create";
  data?: any;
  relatedData?: any;
};
function TeacherForm({
  type,
  data,
  relatedData,
  setOpenModal,
}: TeacherFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherFormInputsTypes>({
    resolver: zodResolver(teacherSchema),
  });

  const [imgUrl, setImgUrl] = useState<any>();
  const [state, formAction] = useFormState(
    type === "create" ? createTeacher : updateTeacher,
    {
      success: false,
      error: false,
    }
  );

  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      toast(`Teacher has been ${type}d sucessfully!`);
      setOpenModal(false);
      router.refresh();
    }
  }, [state, setOpenModal, router, toast]);

  const onSubmit = handleSubmit((data) => {
    formAction({ ...data, img: imgUrl });
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold ">Create a new teacher</h1>
      <span className="text-xs to-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
        />
      </div>
      <span className="text-sm text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Surname"
          name="surname"
          defaultValue={data?.surname}
          register={register}
          error={errors?.surname}
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors?.phone}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors?.address}
        />
        <InputField
          label="Blood Type"
          name="bloodType"
          defaultValue={data?.bloodType}
          register={register}
          error={errors?.bloodType}
        />
        <InputField
          label="Birthday"
          name="birthday"
          defaultValue={data?.birthday.toISOString().split("T")[0]}
          register={register}
          error={errors?.birthday}
          type="date"
        />
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="sex" className="text-xs text-gray-500 gap-0">
            Sex
          </label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option selected value="MALE">
              Male
            </option>
            <option value="FEMALE">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">{errors.sex?.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="subjects" className="text-xs text-gray-500 gap-0">
            subjects
          </label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("subjects")}
            defaultValue={data?.subjects}
          >
            {relatedData.teacherSubjects.map(
              (subject: { id: string; name: string }) => (
                <option value={subject.id} key={subject.id}>
                  {subject.name}
                </option>
              )
            )}
          </select>
          {errors.subjects?.message && (
            <p className="text-xs text-red-400">{errors.subjects?.message}</p>
          )}
        </div>

        <CldUploadWidget
          uploadPreset="school"
          onSuccess={(result, { widget }) => {
            setImgUrl(result.info?.secure_url);
            widget.close();
          }}
        >
          {({ open }) => {
            return (
              <label
                className="text-xs text-gray-500 gap-2 cursor-pointer flex items-center justify-between"
                onClick={() => open()}
              >
                <Image src="/upload.png" alt="upload" width={28} height={28} />
                <span>upload an image</span>
              </label>
            );
          }}
        </CldUploadWidget>
      </div>
      {state.error && (
        <span className="text-red-500">something went wrong!</span>
      )}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "create" : "update"}
      </button>
    </form>
  );
}

export default TeacherForm;
