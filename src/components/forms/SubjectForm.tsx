"use client";
import { Dispatch, SetStateAction, useEffect } from "react";

import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "@/components/InputField";
import { createSubject, updateSubject } from "../actions";
import {
  SubjectFormInputsTypes,
  subjectSchema,
} from "../formsValidationSchemas";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type SubjectFormProps = {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  type: "update" | "create";
  data?: any;
};
function SubjectForm({ setOpenModal, type, data }: SubjectFormProps) {
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

  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      toast(`Subject has been ${type}d sucessfully!`);
      setOpenModal(false);
      router.refresh();
    }
  }, [state]);

  const onSubmit = handleSubmit((data) => {
    formAction(data);
  });

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
          error={errors?.name}
        />
        {data && (
          <InputField
            label="id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}
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

export default SubjectForm;
