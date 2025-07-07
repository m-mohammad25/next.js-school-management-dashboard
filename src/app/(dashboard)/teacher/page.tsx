import { Announcements, BigCalnedar } from "@/components";

const TeacherPage = () => {
  return (
    <div className="flex flex-col xl:flex-row p-4 gap-4 flex-1">
      {/* Left  */}
      <div className="w-full xl:w-2/3">
        <div className="bg-white h-full p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule (4A)</h1>
          <BigCalnedar />
        </div>
      </div>
      {/* Right */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8 ">
        <Announcements />
      </div>
    </div>
  );
};

export default TeacherPage;
