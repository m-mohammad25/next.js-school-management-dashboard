import prisma from "@/lib/prisma";
import { adjuctScheduleToCurrentWeek } from "@/lib/utils";

const useLessonsData = async (
  type: "teacherId" | "classId",
  id: string | number
): Promise<
  {
    title: string;
    start: Date;
    allDay: boolean;
    end: Date;
  }[]
> => {
  const dataRes = await prisma.lesson.findMany({
    where: { [type]: id },
  });

  const lessonsData = dataRes.map((lesson) => ({
    title: lesson.name,
    allDay: false,
    start: lesson.startTime,
    end: lesson.endTime,
  }));

  const adjustedLessonsData = adjuctScheduleToCurrentWeek(lessonsData);

  return adjustedLessonsData;
};

export default useLessonsData;
