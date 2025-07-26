import prisma from "@/lib/prisma";
import { getUserId, getUserRole } from "@/lib/utils";

async function Announcements() {
  const role = await getUserRole();
  const userId = await getUserId();

  const roleConditions = {
    teacher: { lessons: { some: { teacherId: userId } } },
    student: { students: { some: { id: userId } } },
    parent: { students: { some: { parentId: userId } } },
  };
  const annoucements = await prisma.announcement.findMany({
    take: 3,
    orderBy: { date: "desc" },
    where: {
      ...(role !== "admin" && {
        OR: [
          { classId: null },
          { class: roleConditions[role as keyof typeof roleConditions] || {} },
        ],
      }),
    },
  });

  return (
    <div className="bg-white rounded-md p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {annoucements[0] && (
          <div className="bg-lamaSkyLight rounded-md p-4">
            <div className="flex justify-between items-center">
              <h2 className="font-medium">{annoucements[0].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md p-1">
                {new Intl.DateTimeFormat("en-GB").format(annoucements[0].date)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {annoucements[0].description}
            </p>
          </div>
        )}

        {annoucements[1] && (
          <div className="bg-lamaPurpleLight rounded-md p-4">
            <div className="flex justify-between items-center">
              <h2 className="font-medium">{annoucements[1].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md p-1">
                {new Intl.DateTimeFormat("en-GB").format(annoucements[1].date)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {annoucements[1].description}
            </p>
          </div>
        )}

        {annoucements[2] && (
          <div className="bg-lamaYellowLight rounded-md p-4">
            <div className="flex justify-between items-center">
              <h2 className="font-medium">{annoucements[2].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md p-1">
                {new Intl.DateTimeFormat("en-GB").format(annoucements[2].date)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {annoucements[2].description}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Announcements;
