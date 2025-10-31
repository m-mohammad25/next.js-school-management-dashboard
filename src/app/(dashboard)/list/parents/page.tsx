import Image from "next/image";

import FormModalContainer from "@/components/FormModalContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";

import prisma from "@/lib/prisma";
import { Student, Parent, Prisma } from "@prisma/client";
import { getUserRole } from "@/lib/utils";
import { ITEMS_PER_PAGE } from "@/lib/settings";

type ParentList = Parent & { students: Student[] };

async function ParentsListPage({
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
      header: "Student Names",
      accessor: "students",
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
    ...(role === "admin" || role === "guest"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (parent: ParentList) => (
    <tr
      key={parent.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{parent.name}</h3>
          <p className="text-xs text-gray-500">{parent?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">
        {parent.students.map((student) => student.name).join(", ")}
      </td>
      <td className="hidden md:table-cell">{parent.phone}</td>
      <td className="hidden md:table-cell">{parent.address}</td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "guest") && (
            <>
              <FormModalContainer table="parent" type="update" data={parent} />
              <FormModalContainer table="parent" type="delete" id={parent.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
  const { page, ...queryParams } = searchParams;

  const pageNumber = page ? parseInt(page) : 1;

  // URL Query Params Condition

  const query: Prisma.ParentWhereInput = {};

  for (let [key, value] of Object.entries(queryParams)) {
    if (value != undefined) {
      switch (key) {
        case "search":
          query.name = { contains: value, mode: "insensitive" };
          break;
        default:
          break;
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.parent.findMany({
      where: query,
      include: {
        students: true,
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (pageNumber - 1),
    }),

    prisma.parent.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Parents</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {(role === "admin" || role === "guest") && (
              <FormModalContainer table="parent" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination pageNumber={pageNumber} count={count} />
    </div>
  );
}

export default ParentsListPage;
