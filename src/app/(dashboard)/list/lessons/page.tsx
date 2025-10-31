import Image from "next/image";

import FormModalContainer from "@/components/FormModalContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";

import { Class, Prisma, Subject, Teacher, Lesson } from "@prisma/client";
import prisma from "@/lib/prisma";

import { getUserRole } from "@/lib/utils";
import { ITEMS_PER_PAGE } from "@/lib/settings";

type LessonList = Lesson & { subject: Subject; class: Class; teacher: Teacher };

async function LessonsListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const role = await getUserRole();
  const columns = [
    {
      header: "Subject Name",
      accessor: "name",
    },
    {
      header: "Class",
      accessor: "class",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden md:table-cell",
    },
    ...(role === "admin" || role === "guest"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];
  const renderRow = (lesson: LessonList) => (
    <tr
      key={lesson.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{lesson.subject.name}</td>
      <td>{lesson.class.name}</td>
      <td className="hidden md:table-cell">{`${lesson.teacher.name} ${lesson.teacher.surname}`}</td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "guest") && (
            <>
              <FormModalContainer table="lesson" type="update" data={lesson} />
              <FormModalContainer table="lesson" type="delete" id={lesson.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
  const { page, ...queryParams } = searchParams;

  const pageNumber = page ? parseInt(page) : 1;

  // URL Query Params Condition

  const query: Prisma.LessonWhereInput = {};

  for (let [key, value] of Object.entries(queryParams)) {
    if (value != undefined) {
      switch (key) {
        case "classId":
          query.classId = +value;
          break;

        case "teacherId":
          query.teacherId = value;
          break;

        case "search":
          query.OR = [
            { subject: { name: { contains: value, mode: "insensitive" } } },
            { teacher: { name: { contains: value, mode: "insensitive" } } },
          ];
          break;

        default:
          break;
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.lesson.findMany({
      where: query,
      include: {
        subject: { select: { name: true } },
        class: { select: { name: true } },
        teacher: { select: { name: true, surname: true } },
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (pageNumber - 1),
    }),

    prisma.lesson.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white flex-1 m-4 mt-4 roudned-md p-4">
      {/* TOP  */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block font-semibold text-lg">All Lessons</h1>
        <div className="flex flex-col md:flex-row items-center w-full md:w-auto gap-4">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="filter" width={14} height={14} />
            </button>

            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="filter" width={14} height={14} />
            </button>

            {(role === "admin" || role === "guest") && (
              <FormModalContainer table="lesson" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* LIST */}
      <div>
        <Table columns={columns} renderRow={renderRow} data={data} />
      </div>

      {/* Pagination  */}
      <Pagination pageNumber={pageNumber} count={count} />
    </div>
  );
}

export default LessonsListPage;
