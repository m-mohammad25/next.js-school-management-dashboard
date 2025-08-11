"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import {
  deleteClass,
  deleteStudent,
  deleteSubject,
  deleteTeacher,
} from "./actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { formModalContainerProps } from "./FormModalContainer";

const deleteActionMap = {
  subject: deleteSubject,
  class: deleteClass,
  teacher: deleteTeacher,
  student: deleteStudent,
  exam: deleteSubject,
  // TODO: OTHER DELETE ACTIONS
  parent: deleteSubject,
  lesson: deleteSubject,
  assignment: deleteSubject,
  result: deleteSubject,
  attendance: deleteSubject,
  event: deleteSubject,
  announcement: deleteSubject,
};

const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Loading...</h1>,
});
const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});

const ClassForm = dynamic(() => import("./forms/ClassForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (
    setOpenModal: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update",
    data?: any,
    relatedData?: any
  ) => JSX.Element;
} = {
  subject: (setOpenModal, type, data, relatedData) => (
    <SubjectForm
      type={type}
      data={data}
      setOpenModal={setOpenModal}
      relatedData={relatedData}
    />
  ),

  class: (setOpenModal, type, data, relatedData) => (
    <ClassForm
      type={type}
      data={data}
      setOpenModal={setOpenModal}
      relatedData={relatedData}
    />
  ),
  teacher: (setOpenModal, type, data, relatedData) => (
    <TeacherForm
      type={type}
      data={data}
      setOpenModal={setOpenModal}
      relatedData={relatedData}
    />
  ),
  student: (setOpenModal, type, data, relatedData) => (
    <StudentForm
      type={type}
      data={data}
      setOpenModal={setOpenModal}
      relatedData={relatedData}
    />
  ),
};

function FormModal({
  table,
  type,
  data,
  id,
  relatedData,
}: formModalContainerProps & { relatedData?: any }) {
  const [openModal, setOpenModal] = useState(false);

  const Form = () => {
    const [state, deleteAction] = useFormState(deleteActionMap[table], {
      success: false,
      error: false,
    });

    const router = useRouter();
    useEffect(() => {
      if (state.success) {
        toast(`${table} has been deleted sucessfully!`);
        setOpenModal(false);
        router.refresh();
      }
    }, [state]);
    return type === "delete" && id ? (
      <form
        action={deleteAction}
        className="mt-3 flex flex-col items-center gap-4"
      >
        <input type="text | number" name="id" value={id} hidden />
        <span className="text-center font-semibold">{`Are you sure you want to delete this ${table}? All data will be lost`}</span>
        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none">
          Delete
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](setOpenModal, type, data, relatedData)
    ) : (
      "NO FORM FOUND!"
    );
  };

  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";

  return (
    <>
      <button
        className={`${size}  ${bgColor} flex items-center justify-center rounded-full`}
        onClick={() => setOpenModal(true)}
      >
        <Image src={`/${type}.png`} alt={`${type}`} width={16} height={16} />
      </button>
      {openModal && (
        <div className="fixed top-0 left-0 w-screen h-screen z-50 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div className="absolute top-4 right-4 cursor-pointer">
              <Image
                src="/close.png"
                width={16}
                height={16}
                alt="close"
                onClick={() => setOpenModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FormModal;
