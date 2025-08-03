import prisma from "@/lib/prisma";
import FormModal from "./FormModal";

export type formModalContainerProps = {
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
  id?: number | string;
};

async function FormModalContainer({
  table,
  type,
  data,
  id,
}: formModalContainerProps) {
  let relatedData = {};

  console.log("hey!");
  if (type !== "delete") {
    console.log("hey!");
    switch (table) {
      case "subject":
        const subjectTeachers = await prisma.teacher.findMany({
          select: {
            id: true,
            name: true,
            surname: true,
          },
        });
        relatedData = { teachers: subjectTeachers };
        console.log(relatedData);
        break;
      default:
        break;
    }
  }
  return (
    <div>
      <FormModal
        id={id}
        type={type}
        table={table}
        data={data}
        relatedData={relatedData}
      />
    </div>
  );
}

export default FormModalContainer;
