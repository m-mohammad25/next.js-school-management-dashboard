"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";

import InputField from "@/components/InputField";

import {
  CreateParentInputs,
  createParentSchema,
  UpdateParentInputs,
  updateParentSchema,
} from "../formsValidationSchemas";

import { toast } from "react-toastify";
import { createParent, updateParent } from "../actions";
import { FormProps } from "./types";

function ParentForm({ type, data, setOpenModal }: FormProps) {
  const router = useRouter();

  const [state, formAction] = useFormState(
    type === "create" ? createParent : updateParent,
    {
      success: false,
      error: false,
    }
  );
  useEffect(() => {
    if (state.success) {
      toast(`Parent has been ${type}d sucessfully!`);
      setOpenModal(false);
      router.refresh();
    }
  }, [state, toast, setOpenModal, router]);

  const form =
    type === "create"
      ? useForm<CreateParentInputs>({
          resolver: zodResolver(createParentSchema),
        })
      : useForm<UpdateParentInputs>({
          resolver: zodResolver(updateParentSchema),
        });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = handleSubmit((formData) => {
    const payload = { ...formData, id: data?.id };
    formAction(payload as any);
  });

  const formBody = (
    <>
      <h1 className="text-xl font-semibold ">
        {type === "create" ? "Create a new parent" : "Update parent"}
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
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-8 overflow-scroll md:overflow-auto px-2 max-h-[80vh] md:max-h-none"
    >
      {formBody}
    </form>
  );
}

export default ParentForm;
