import Image from "next/image";
import Link from "next/link";

import { Class, Prisma, Student } from "@prisma/client";
import prisma from "@/lib/prisma";

import FormModalContainer from "@/components/FormModalContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";

import { ITEMS_PER_PAGE } from "@/lib/settings";
import { getUserRole } from "@/lib/utils";

type StudentList = Student & { class: Class };

async function StudentsListsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const role = await getUserRole();

  const columns = [
    {
      header: "Info",
      accessor: "info",
    },
    {
      header: "Student ID",
      accessor: "studentId",
      className: "hidden md:table-cell",
    },
    {
      header: "Grade",
      accessor: "grade",
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
  const renderRow = (student: StudentList) => (
    <tr
      key={student.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center p-4 gap-4">
        <Image
          src={student.img || "/noAvatar.png"}
          alt="student image"
          width={40}
          height={40}
          className="rounded-full object-cover md:hidden xl:block w-10 h-10"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{student.name}</h3>
          <p className="text-xs to-gray-500">{student.class.name}</p>
        </div>
      </td>

      <td className="hidden md:table-cell">{student.username}</td>
      <td className="hidden md:table-cell">{student.gradeId}</td>
      <td className="hidden md:table-cell">{student.phone}</td>
      <td className="hidden md:table-cell">{student.address}</td>

      <td className="flex items-center gap-2">
        <Link href={`/list/students/${student.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
            <Image src="/view.png" alt="view" width={16} height={16} />
          </button>
        </Link>

        {role == "admin" && (
          <FormModalContainer table="student" type="delete" id={student.id} />
        )}
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;

  const pageNumber = page ? parseInt(page) : 1;

  // URL Query Params Condition

  const query: Prisma.StudentWhereInput = {};

  for (let [key, value] of Object.entries(queryParams)) {
    if (value != undefined) {
      switch (key) {
        case "teacherId":
          query.class = {
            lessons: { some: { teacherId: value } },
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
    prisma.student.findMany({
      where: query,
      include: {
        class: true,
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (pageNumber - 1),
    }),

    prisma.student.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white flex-1 m-4 mt-4 roudned-md p-4">
      {/* TOP  */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block font-semibold text-lg">All Students</h1>
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
              <FormModalContainer table="student" type="create" />
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

export default StudentsListsPage;
