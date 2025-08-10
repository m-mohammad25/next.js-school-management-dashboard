import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";

import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/utils";

const StudentPage = async () => {
  const studentId = await getUserId();
  const classItem = await prisma.student.findUnique({
    where: {
      id: studentId,
    },
    select: {
      classId: true,
    },
  });
  return (
    <div className="flex flex-col xl:flex-row p-4 gap-4">
      {/* Left  */}
      <div className="w-full xl:w-2/3">
        <div className="bg-white h-full p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule (4A)</h1>
          <BigCalendarContainer type="classId" id={classItem?.classId!} />
        </div>
      </div>
      {/* Right */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;
