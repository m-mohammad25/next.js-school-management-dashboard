import prisma from "@/lib/prisma";
import BigCalnedar from "./BigCalendar";

async function BigCalendarContainer({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string | number;
}) {
  const dataRes = await prisma.lesson.findMany({
    where: { [type]: id },
  });

  const lessonsData = dataRes.map((lesson) => ({
    title: lesson.name,
    allDay: false,
    start: lesson.startTime,
    end: lesson.endTime,
  }));

  return <BigCalnedar data={lessonsData} />;
}
export default BigCalendarContainer;
