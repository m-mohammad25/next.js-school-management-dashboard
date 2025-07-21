import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { getUserRole } from "@/lib/utils";
import { Class, Prisma, Teacher } from "@prisma/client";
import Image from "next/image";

type ClassList = Class & { supervisor: Teacher };

async function ClassesListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const role = await getUserRole();

  const columns = [
    {
      header: "Class Name",
      accessor: "name",
    },
    {
      header: "Capacity",
      accessor: "capacity",
      className: "hidden md:table-cell",
    },
    {
      header: "Grade",
      accessor: "grade",
      className: "hidden md:table-cell",
    },
    {
      header: "Supervisor",
      accessor: "supervisor",
      className: "hidden md:table-cell",
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

  const renderRow = (classItem: ClassList) => (
    <tr
      key={classItem.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{classItem.name}</td>
      <td className="hidden md:table-cell">{classItem.capacity}</td>
      <td className="hidden md:table-cell">{classItem.name[0]}</td>
      <td className="hidden md:table-cell">{`${classItem.supervisor.name} ${classItem.supervisor.surname}`}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <FormModal table="class" type="delete" id={classItem.id} />
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;

  const pageNumber = page ? parseInt(page) : 1;

  // URL Query Params Condition

  const query: Prisma.ClassWhereInput = {};

  for (let [key, value] of Object.entries(queryParams)) {
    if (value != undefined) {
      switch (key) {
        case "supervisorId":
          query.supervisorId = value;
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
    prisma.class.findMany({
      where: query,
      include: {
        supervisor: true,
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (pageNumber - 1),
    }),

    prisma.class.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white flex-1 m-4 mt-4 roudned-md p-4">
      {/* TOP  */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block font-semibold text-lg">All Classes</h1>
        <div className="flex flex-col md:flex-row items-center w-full md:w-auto gap-4">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="filter" width={14} height={14} />
            </button>

            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="filter" width={14} height={14} />
            </button>

            {role === "admin" && <FormModal table="class" type="create" />}
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

export default ClassesListPage;
