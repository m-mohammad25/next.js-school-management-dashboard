"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { CldUploadWidget } from "next-cloudinary";

import InputField from "@/components/InputField";

import {
  CreateTeacherInputs,
  createTeacherSchema,
  UpdateTeacherInputs,
  updateTeacherSchema,
} from "../formsValidationSchemas";

import { toast } from "react-toastify";
import { createTeacher, updateTeacher } from "../actions";

type TeacherFormProps = {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update";
  data?: any;
  relatedData?: any;
};

function TeacherForm({
  type,
  data,
  relatedData,
  setOpenModal,
}: TeacherFormProps) {
  const [imgUrl, setImgUrl] = useState<string>(data?.img || "/noAvatar.png");

  const router = useRouter();

  const [state, formAction] = useFormState(
    type === "create" ? createTeacher : updateTeacher,
    {
      success: false,
      error: false,
    }
  );

  useEffect(() => {
    if (state.success) {
      toast(`Teacher has been ${type}d sucessfully!`);
      setOpenModal(false);
      router.refresh();
    }
  }, [state, toast, setOpenModal, router]);

  const form =
    type === "create"
      ? useForm<CreateTeacherInputs>({
          resolver: zodResolver(createTeacherSchema),
        })
      : useForm<UpdateTeacherInputs>({
          resolver: zodResolver(updateTeacherSchema),
        });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = handleSubmit((formData) => {
    const payload = { ...formData, img: imgUrl };
    formAction(payload as any);
  });

  const formBody = (
    <>
      <h1 className="text-xl font-semibold ">
        {type === "create" ? "Create a new teacher" : "Update teacher"}
      </h1>
      <span className="text-xs to-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username || state?.fieldErrors?.username?.[0]}
        />
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email || state?.fieldErrors?.email?.[0]}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password || state?.fieldErrors?.password?.[0]}
        />
      </div>
      <span className="text-sm text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <CldUploadWidget
          uploadPreset="school"
          onSuccess={(result, { widget }) => {
            if (
              result &&
              typeof result.info === "object" &&
              "secure_url" in result.info
            ) {
              setImgUrl(result.info?.secure_url);
            }
            widget.close();
          }}
        >
          {({ open }) => {
            return (
              <div className="flex items-center gap-4">
                <label
                  className="text-xs text-gray-500 gap-2 cursor-pointer flex items-center justify-between"
                  onClick={() => open()}
                >
                  <Image
                    src="/upload.png"
                    alt="upload"
                    width={28}
                    height={28}
                  />
                  <span>upload an image</span>
                </label>
                {imgUrl && (
                  <Image
                    src={imgUrl}
                    alt="Uploaded preview"
                    width={50}
                    height={50}
                    className="rounded-md border"
                  />
                )}
              </div>
            );
          }}
        </CldUploadWidget>

        <InputField
          label="Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name || state?.fieldErrors?.name?.[0]}
        />
        <InputField
          label="Surname"
          name="surname"
          defaultValue={data?.surname}
          register={register}
          error={errors?.surname || state?.fieldErrors?.surname?.[0]}
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors?.phone || state?.fieldErrors?.phone?.[0]}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors?.address || state?.fieldErrors?.address?.[0]}
        />
        <InputField
          label="Blood Type"
          name="bloodType"
          defaultValue={data?.bloodType}
          register={register}
          error={errors?.bloodType || state?.fieldErrors?.bloodType?.[0]}
        />
        <InputField
          label="Birthday"
          name="birthday"
          defaultValue={data?.birthday?.toISOString().split("T")[0]}
          register={register}
          error={errors?.birthday || state?.fieldErrors?.birthday?.[0]}
          type="date"
        />
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id || state?.fieldErrors?.id?.[0]}
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
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">{errors.sex?.message}</p>
          )}
          {state?.fieldErrors?.sex?.[0] && (
            <p className="text-xs text-red-400">
              {state?.fieldErrors?.sex?.[0]}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="subjects" className="text-xs text-gray-500 gap-0">
            Subjects
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
          {state?.fieldErrors?.subjects?.[0] && (
            <p className="text-xs text-red-400">{errors.subjects?.message}</p>
          )}
        </div>
      </div>
      {state?.message && <span className="text-red-500">{state.message}</span>}
      {state?.fieldErrors?.clerk && (
        <span className="text-red-500">{state?.fieldErrors?.clerk?.[0]}</span>
      )}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "create" : "update"}
      </button>
    </>
  );

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      {formBody}
    </form>
  );
}

export default TeacherForm;
