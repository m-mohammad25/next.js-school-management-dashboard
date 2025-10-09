import prisma from "@/lib/prisma";
import { adjuctScheduleToCurrentWeek } from "@/lib/utils";

const useLessonsData = async (
  type: "teacherId" | "classId",
  id: string | number
): Promise<
  | {
      title: string;
      start: Date;
      allDay: boolean;
      end: Date;
    }[]
  | undefined
> => {
  const dataRes = await prisma.lesson.findMany({
    where: {
      ...(type === "teacherId"
        ? { teacherId: id as string }
        : { classId: id as number }),
    },
    include: {
      subject: {
        select: {
          name: true,
        },
      },
    },
  });

  const data = dataRes.map((lesson) => ({
    title: lesson.subject.name,
    start: lesson.startTime,
    end: lesson.endTime,
    allDay: false,
  }));

  const schedule = adjuctScheduleToCurrentWeek(data);

  return schedule;
};

export default useLessonsData;
