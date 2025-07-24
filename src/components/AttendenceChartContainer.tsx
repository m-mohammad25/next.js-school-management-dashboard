import Image from "next/image";
import AttendenceChart from "./AttendenceChart";
import prisma from "@/lib/prisma";

async function AttendenceChartContainer() {
  const today = new Date();
  const dayWeek = today.getDay();
  const daysSinceLastMonday = dayWeek === 0 ? 6 : dayWeek - 1; //if sunday, 6 days since the last monday
  const lastMonday = new Date(today);

  lastMonday.setDate(today.getDate() - daysSinceLastMonday);

  const resData = await prisma.attendance.findMany({
    where: {
      date: {
        gte: lastMonday,
      },
    },
    select: {
      date: true,
      present: true,
    },
  });

  let attendenceData = [
    { name: "Sun", present: 0, absent: 0 },
    { name: "Mon", present: 0, absent: 0 },
    { name: "Tue", present: 0, absent: 0 },
    { name: "Wed", present: 0, absent: 0 },
    { name: "Thu", present: 0, absent: 0 },
    { name: "Fri", present: 0, absent: 0 },
    { name: "Sat", present: 0, absent: 0 },
  ];
  // we will take later only days from mon to fri, since sun & sat are weekends, but we'll keep them now because they play a role in indexing the array

  resData.forEach((attendence) => {
    const attendenceDayInd = new Date(attendence.date).getDay();
    if (attendenceDayInd >= 1 && attendenceDayInd <= 5) {
      if (attendence.present) {
        attendenceData[attendenceDayInd].present += 1;
      } else {
        attendenceData[attendenceDayInd].absent += 1;
      }
    }
  });

  return (
    <div className="bg-white h-full rounded-lg p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendence</h1>
        <Image src="/moreDark.png" alt="more" width={20} height={20} />
      </div>
      <AttendenceChart data={attendenceData.slice(1, 6)} />
    </div>
  );
}

export default AttendenceChartContainer;
