import useLessonsData from "@/hooks/useLessonsData";
import BigCalnedar from "./BigCalendar";

async function BigCalendarContainer() {
  const lessons = await useLessonsData();

  return <BigCalnedar data={lessons} />;
}
export default BigCalendarContainer;
