import prisma from "@/lib/prisma";
import {
  adjuctScheduleToCurrentWeek,
  getUserId,
  getUserRole,
} from "@/lib/utils";

const useLessonsData = async (): Promise<
  | {
      title: string;
      start: Date;
      allDay: boolean;
      end: Date;
    }[]
  | undefined
> => {
  const role = await getUserRole();
  const userId = await getUserId();

  let dataRes;

  if (role === "teacher") {
    dataRes = await prisma.lesson.findMany({
      where: { teacherId: userId as string },
    });
  } else if (role === "student") {
    const classItem = await prisma.class.findFirst({
      where: { students: { some: { id: userId! } } },
    });

    dataRes = await prisma.lesson.findMany({
      where: { classId: classItem!.id },
    });
  }

  const lessonsData = dataRes?.map((lesson) => ({
    title: lesson.name,
    allDay: false,
    start: lesson.startTime,
    end: lesson.endTime,
  }));

  let lessons;

  if (lessonsData) {
    lessons = adjuctScheduleToCurrentWeek(lessonsData);
  }

  return lessons;
};

export default useLessonsData;
