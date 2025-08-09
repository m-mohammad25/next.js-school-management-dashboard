import prisma from "@/lib/prisma";
import { getUserRole } from "@/lib/utils";
import { Teacher } from "@prisma/client";
import { notFound } from "next/navigation";

async function UserSingleTeacherPage(id: string) {
  const role = await getUserRole();
  const teacherData:
    | (Teacher & {
        _count: { lessons: number; subjects: number; classes: number };
      })
    | null = await prisma.teacher.findUnique({
    where: { id: id },
    include: {
      _count: {
        select: {
          lessons: true,
          subjects: true,
          classes: true,
        },
      },
    },
  });

  if (teacherData === null) {
    return notFound();
  }
  return { role, teacherData };
}

export default UserSingleTeacherPage;
