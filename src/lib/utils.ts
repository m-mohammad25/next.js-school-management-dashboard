import { currentUser } from "@clerk/nextjs/server";

export const getUserRole = async () => {
  const user = await currentUser();
  return user?.publicMetadata.role as string;
};

export const getUserId = async () => {
  const user = await currentUser();
  return user?.id;
};

export const getLatestMonday = () => {
  const today = new Date();
  const dayWeek = today.getDay();
  const daysSinceLastMonday = dayWeek === 0 ? 6 : dayWeek - 1; //if sunday, 6 days since the last monday
  const lastMonday = new Date(today);

  lastMonday.setDate(today.getDate() - daysSinceLastMonday);
  return lastMonday;
};

export const adjuctScheduleToCurrentWeek = (
  lessons: { title: string; allDay: boolean; start: Date; end: Date }[]
): { title: string; start: Date; allDay: boolean; end: Date }[] => {
  const lastMonday = getLatestMonday();
  return lessons.map((lesson) => {
    const lessonDayOfWeek = lesson.start.getDay();
    const daysSinceMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1;
    const adjustedStartDate = new Date(lastMonday);

    adjustedStartDate.setDate(lastMonday.getDate() + daysSinceMonday);
    adjustedStartDate.setHours(
      lesson.start.getHours(),
      lesson.start.getMinutes(),
      lesson.start.getSeconds()
    );

    const adjuctedEndDate = new Date(adjustedStartDate);

    adjuctedEndDate.setHours(
      lesson.end.getHours(),
      lesson.end.getMinutes(),
      lesson.end.getSeconds()
    );

    return {
      title: lesson.title,
      allDay: false,
      start: adjustedStartDate,
      end: adjuctedEndDate,
    };
  });
};
