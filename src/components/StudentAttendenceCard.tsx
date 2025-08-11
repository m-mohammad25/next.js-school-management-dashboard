import prisma from "@/lib/prisma";

async function StudentAttendenceCard({ studentId }: { studentId: string }) {
  const attendences = await prisma.attendance.findMany({
    where: {
      studentId: studentId,
      date: {
        gte: new Date(new Date().getFullYear(), 0, 1),
      },
    },
  });

  const presentDaysCount = attendences.filter(
    (attendence) => attendence.present
  ).length;
  const attendancePersentage = (presentDaysCount / attendences.length) * 100;

  return (
    <div className="">
      <h1 className="text-xl font-semibold">{`${
        attendancePersentage || "-"
      }%`}</h1>
      <span className="text-sm text-gray-400">Attendance</span>
    </div>
  );
}

export default StudentAttendenceCard;
