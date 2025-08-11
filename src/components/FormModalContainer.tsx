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

  if (type !== "delete") {
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
        break;

      case "class":
        const classTeachers = await prisma.teacher.findMany({
          select: {
            id: true,
            name: true,
            surname: true,
          },
        });

        const grades = await prisma.grade.findMany({
          select: {
            id: true,
            level: true,
          },
        });
        relatedData = { teachers: classTeachers, grades };
        break;

      case "teacher":
        const teacherSubjects = await prisma.subject.findMany({
          select: {
            id: true,
            name: true,
          },
        });

        relatedData = { teacherSubjects: teacherSubjects };
        break;

      case "student":
        const studentsClasses = await prisma.class.findMany({
          include: {
            _count: { select: { students: true } },
          },
        });

        const studentsGrades = await prisma.grade.findMany({
          select: {
            id: true,
            level: true,
          },
        });

        const studentsParents = await prisma.parent.findMany({
          select: {
            id: true,
          },
        });

        relatedData = { studentsClasses, studentsGrades, studentsParents };
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
