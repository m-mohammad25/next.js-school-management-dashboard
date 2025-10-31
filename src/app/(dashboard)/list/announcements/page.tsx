import Image from "next/image";
import prisma from "@/lib/prisma";
import { Announcement, Class, Prisma } from "@prisma/client";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { getUserId, getUserRole } from "@/lib/utils";

import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import FormModalContainer from "@/components/FormModalContainer";

type AnnouncementList = Announcement & { class: Class };

async function AnnouncementsListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const role = await getUserRole();
  const userId = await getUserId();

  const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Class",
      accessor: "class",
    },
    {
      header: "Date",
      accessor: "date",
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
  const renderRow = (announcement: AnnouncementList) => (
    <tr
      key={announcement.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{announcement.title}</td>
      <td>{announcement.class?.name || "-"}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(announcement.date)}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "guest") && (
            <>
              <FormModalContainer
                table="announcement"
                type="update"
                data={announcement}
              />
              <FormModalContainer
                table="announcement"
                type="delete"
                id={announcement.id}
              />
            </>
          )}
        </div>
      </td>
    </tr>
  );
  const { page, ...queryParams } = searchParams;

  const pageNumber = page ? parseInt(page) : 1;

  // URL Query Params Condition

  const query: Prisma.AnnouncementWhereInput = {};

  for (let [key, value] of Object.entries(queryParams)) {
    if (value != undefined) {
      switch (key) {
        case "search":
          query.title = { contains: value, mode: "insensitive" };
          break;
        default:
          break;
      }
    }
  }

  // Role Conditions

  const roleConditions = {
    teacher: { lessons: { some: { teacherId: userId! } } },
    student: { students: { some: { id: userId! } } },
    parent: { students: { some: { parentId: userId! } } },
  };

  if (role !== "admin" && role !== "guest") {
    query.OR = [
      { classId: null },
      {
        class: roleConditions[role as keyof typeof roleConditions] || {}, // {} fetch every thing in case the role of admin
      },
    ];
  }
  const [data, count] = await prisma.$transaction([
    prisma.announcement.findMany({
      where: query,
      include: {
        class: { select: { name: true } },
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (pageNumber - 1),
    }),

    prisma.announcement.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white flex-1 m-4 mt-4 roudned-md p-4">
      {/* TOP  */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block font-semibold text-lg">
          All Announcement
        </h1>
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
              <FormModalContainer table="announcement" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* LIST */}
      <div>
        <Table columns={columns} renderRow={renderRow} data={data} />
      </div>

      {/* Pagination  */}
      <Pagination count={count} pageNumber={pageNumber} />
    </div>
  );
}

export default AnnouncementsListPage;
