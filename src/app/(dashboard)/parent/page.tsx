import Announcements from "@/components/Announcements";
import BigCalnedarContainer from "@/components/BigCalendarContainer";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/utils";

const ParentPage = async () => {
  const userId = await getUserId();

  const children = await prisma.student.findMany({
    where: { parentId: userId },
  });

  return (
    <div className="flex flex-col xl:flex-row p-4 gap-4 flex-1">
      {/* Left  */}
      <div className="w-full xl:w-2/3">
        <div className="bg-white h-full p-4 rounded-md">
          {children.map((child) => (
            <div className="mb-5">
              <h1 className="text-xl font-semibold">
                Schedule {`${child.name}`}
              </h1>
              <BigCalnedarContainer type="classId" id={child.classId} />
            </div>
          ))}
        </div>
      </div>
      {/* Right */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8 ">
        <Announcements />
      </div>
    </div>
  );
};

export default ParentPage;
