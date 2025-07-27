import useLessonsData from "@/hooks/useLessonsData";
import BigCalnedar from "./BigCalendar";

async function BigCalendarContainer({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string | number;
}) {
  const adjustedLessonsData = await useLessonsData(type, id);

  return <BigCalnedar data={adjustedLessonsData} />;
}
export default BigCalendarContainer;
