import FormModalContainer from "@/components/FormModalContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { Class, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { ITEMS_PER_PAGE } from "@/lib/settings";

type TeacherList = Teacher & { subjects: Subject[]; classes: Class[] };

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Teacher ID",
    accessor: "teacherId",
    className: "hidden md:table-cell",
  },
  {
    header: "Subjects",
    accessor: "subjects",
    className: "hidden md:table-cell",
  },
  {
    header: "Classes",
    accessor: "classes",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  ...(role === "admin"
    ? [
        {
          header: "Actions",
          accessor: "action",
        },
      ]
    : []),
];
const renderRow = (teacher: TeacherList) => (
  <tr
    key={teacher.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
  >
    <td className="flex items-center p-4 gap-4">
      <Image
        src={teacher.img || "/noAvatar.png"}
        alt="teacher image"
        width={40}
        height={40}
        className="rounded-full object-cover md:hidden xl:block w-10 h-10"
      />
      <div className="flex flex-col">
        <h3 className="font-semibold">{teacher.name}</h3>
        <p className="text-xs to-gray-500">{teacher?.email}</p>
      </div>
    </td>

    <td className="hidden md:table-cell">{teacher.username}</td>
    <td className="hidden md:table-cell">
      {teacher.subjects.map((subject) => subject.name).join(",")}
    </td>
    <td className="hidden md:table-cell">
      {teacher.classes.map((classItem) => classItem.name).join(",")}
    </td>
    <td className="hidden md:table-cell">{teacher.phone}</td>
    <td className="hidden md:table-cell">{teacher.address}</td>

    <td className="flex items-center gap-2">
      <Link href={`teachers/${teacher.id}`}>
        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
          <Image src="/view.png" alt="edit" width={16} height={16} />
        </button>
      </Link>

      {role == "admin" && (
        <FormModalContainer
          table="teacher"
          type="delete"
          id={Number(teacher.id)}
        />
      )}
    </td>
  </tr>
);
async function TeachersListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { page, ...queryParams } = searchParams;

  const pageNumber = page ? parseInt(page) : 1;

  // URL Query Params Condition

  const query: Prisma.TeacherWhereInput = {};

  for (let [key, value] of Object.entries(queryParams)) {
    if (value != undefined) {
      switch (key) {
        case "classId":
          query.lessons = {
            some: { classId: parseInt(value) },
          };
          break;
        case "search":
          query.name = { contains: value, mode: "insensitive" };
          break;
        default:
          break;
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.teacher.findMany({
      where: query,
      include: {
        classes: true,
        subjects: true,
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (pageNumber - 1),
    }),

    prisma.teacher.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white flex-1 m-4 mt-4 roudned-md p-4">
      {/* TOP  */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block font-semibold text-lg">All Teachers</h1>
        <div className="flex flex-col md:flex-row items-center w-full md:w-auto gap-4">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="filter" width={14} height={14} />
            </button>

            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="filter" width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormModalContainer table="teacher" type="create" />
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

export default TeachersListPage;
