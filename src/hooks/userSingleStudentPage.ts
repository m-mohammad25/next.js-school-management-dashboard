import prisma from "@/lib/prisma";
import { getUserRole } from "@/lib/utils";
import { Student, Class } from "@prisma/client";
import { notFound } from "next/navigation";

async function UserSingleStudentPage(id: string) {
  const role = await getUserRole();
  const studentData:
    | (Student & {
        class: Class & {
          _count: { lessons: number };
        };
      })
    | null = await prisma.student.findUnique({
    where: { id: id },
    include: {
      class: {
        include: {
          _count: {
            select: {
              lessons: true,
            },
          },
        },
      },
    },
  });

  if (studentData === null) {
    return notFound();
  }
  return { role, studentData };
}

export default UserSingleStudentPage;
