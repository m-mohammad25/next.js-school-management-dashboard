import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { getUserId, getUserRole } from "@/lib/utils";

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
  const role = await getUserRole();
  const userId = await getUserId();

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

      case "exam":
      case "assignment":
        const teacherLessons = await prisma.lesson.findMany({
          where: {
            ...(role === "teacher" ? { teacherId: userId } : {}),
          },
          select: {
            id: true,
            subject: true,
            class: true,
          },
        });

        relatedData = { lessons: teacherLessons };

        break;

      case "lesson":
        const subjects = await prisma.subject.findMany({
          include: {
            teachers: true,
          },
        });

        const classes = await prisma.class.findMany({
          select: {
            id: true,
            name: true,
          },
        });

        relatedData = { subjects, classes };
        break;

      case "result":
        const exams = await prisma.exam.findMany({
          include: {
            lesson: {
              select: {
                subject: { select: { name: true } },
                class: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        });

        const assignments = await prisma.assignment.findMany({
          include: {
            lesson: {
              select: {
                subject: { select: { name: true } },
                class: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        });

        relatedData = { exams, assignments };
        break;

      case "event":
      case "announcement":
        const eventClasses = await prisma.class.findMany({
          select: {
            id: true,
            name: true,
          },
        });
        relatedData = { classes: eventClasses };
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
