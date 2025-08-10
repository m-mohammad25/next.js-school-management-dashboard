import Image from "next/image";
import Link from "next/link";

import UserSingleTeacherPage from "@/hooks/userSingleTeacherPage";

import Announcements from "@/components/Announcements";
import PreformanceChart from "@/components/PreformanceChart";
import FormModalContainer from "@/components/FormModalContainer";
import { formatDate } from "@/lib/utils";
import BigCalendarContainer from "@/components/BigCalendarContainer";

async function SingleTeacherPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const pageData = await UserSingleTeacherPage(id);

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* lEFT  */}
      <div className="w-full xl:w-2/3">
        {/* TOP  */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD  */}
          <div className="flex flex-1 bg-lamaSky py-6 px-4 rounded-md gap-4">
            <div className="w-1/3">
              <Image
                src={pageData.teacherData.img || "/noAvatar.png"}
                alt="teacher image"
                width={144}
                height={144}
                className="w-36 h-36 object-cover rounded-full"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">{`${pageData.teacherData.name} ${pageData.teacherData.surname}`}</h1>
                {pageData.role === "admin" && (
                  <FormModalContainer
                    type="update"
                    table="teacher"
                    data={pageData.teacherData}
                  />
                )}
              </div>

              <p className="text-sm text-gray-500">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
              <div className="flex items-center justify-between gap-4 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center  gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>{pageData.teacherData.bloodType}</span>
                </div>

                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center  gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>{formatDate(pageData.teacherData.birthday)}</span>
                </div>

                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center  gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{pageData.teacherData.email || "-"}</span>
                </div>

                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center  gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{pageData.teacherData.phone || "-"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SMALL CARDS  */}
          <div className="flex flex-1 justify-between gap-4 flex-wrap">
            {/* Card */}
            <div className="bg-white flex gap-4 items-center w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] p-4 rounded-md ">
              <Image
                src="/singleAttendance.png"
                alt=""
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">90%</h1>
                <span className="text-sm text-gray-400">Attendence</span>
              </div>
            </div>

            {/* Card */}
            <div className="bg-white flex gap-4 items-center w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] p-4 rounded-md ">
              <Image
                src="/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {pageData.teacherData._count.subjects}
                </h1>
                <span className="text-sm text-gray-400">Branches</span>
              </div>
            </div>

            {/* Card */}
            <div className="bg-white flex gap-4 items-center w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] p-4 rounded-md ">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {pageData.teacherData._count.lessons}
                </h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>

            {/* Card */}
            <div className="bg-white flex gap-4 items-center w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] p-4 rounded-md ">
              <Image
                src="/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {pageData.teacherData._count.classes}
                </h1>
                <span className="text-sm text-gray-400">Classes</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Teacher's Schedule</h1>
          <BigCalendarContainer type="teacherId" id={id} />
        </div>
      </div>
      {/* RIGHT  */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white rounded-md p-4">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="p-4 bg-white mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              className="p-4 rounded-md bg-lamaSky"
              href={`/list/classes/supervisorId=teacher2`}
            >
              Teacher's Classes
            </Link>
            <Link
              className="p-4 rounded-md bg-lamaPurpleLight"
              href={`/list/students?teacherId=${"teacher2"}`}
            >
              Teacher's Students
            </Link>
            <Link
              className="p-4 rounded-md bg-lamaYellowLight"
              href={`/list/lessons?teacherId=teacher2`}
            >
              Teacher's Lessons
            </Link>
            <Link
              className="p-4 rounded-md bg-pink-50"
              href={`/list/exams?teacherId=${"teacher12"}`}
            >
              Teacher's Exams
            </Link>
            <Link
              className="p-4 rounded-md bg-lamaSkyLight"
              href={`/list/assignments?teacherId=${"teacher12"}`}
            >
              Teacher's Assignments
            </Link>
          </div>
        </div>
        <PreformanceChart />
        <Announcements />
      </div>
    </div>
  );
}

export default SingleTeacherPage;
