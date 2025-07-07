"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
// import TeacherForm from "./forms/TeacherForm";
// import StudentForm from "./forms/StudentForm";

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});

type formModalProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number;
};

const forms: {
  [key: string]: (type: "create" | "update", data?: any) => JSX.Element;
} = {
  teacher: (type, data) => <TeacherForm type={type} data={data} />,
  student: (type, data) => <StudentForm type={type} data={data} />,
};
function FormModal({ table, type, data, id }: formModalProps) {
  const [openModal, setOpenModal] = useState(false);

  const Form = () => {
    return type === "delete" && id ? (
      <form
        onSubmit={(e) => e.preventDefault()}
        action=""
        className="mt-3 flex flex-col items-center gap-4"
      >
        <span className="text-center font-semibold">{`Are you sure you want to delete this ${table}? All data will be lost`}</span>
        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none">
          Delete
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](type, data)
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
