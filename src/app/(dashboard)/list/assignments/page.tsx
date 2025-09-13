import Image from "next/image";
import prisma from "@/lib/prisma";
import { Assignment, Class, Prisma, Subject, Teacher } from "@prisma/client";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { getUserId, getUserRole } from "@/lib/utils";

import FormModalContainer from "@/components/FormModalContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";

type AssignmentList = Assignment & {
  lesson: {
    subject: Subject;
    teacher: Teacher;
    class: Class;
  };
};
async function AssignmentsListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const role = await getUserRole();
  const userId = await getUserId();

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
    {
      header: "Due Date",
      accessor: "dueDate",
      className: "hidden md:table-cell",
    },
    ...(role === "admin" || role === "teacher"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];
  const renderRow = (assignment: AssignmentList) => (
    <tr
      key={assignment.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        {assignment.lesson.subject.name}
      </td>
      <td>{assignment.lesson.class.name}</td>
      <td className="hidden md:table-cell">
        {assignment.lesson.teacher.name +
          " " +
          assignment.lesson.teacher.surname}
      </td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(assignment.dueDate)}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormModalContainer
                table="assignment"
                type="update"
                data={assignment}
              />

              <FormModalContainer
                table="assignment"
                type="delete"
                id={assignment.id}
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

  const query: Prisma.AssignmentWhereInput = {};

  for (let [key, value] of Object.entries(queryParams)) {
    if (value != undefined) {
      switch (key) {
        case "teacherId":
          query.lesson = { teacherId: value };
          break;

        case "classId":
          query.lesson = { classId: parseInt(value) };
          break;

        case "search":
          query.lesson = {
            subject: { name: { contains: value, mode: "insensitive" } },
          };
          break;

        default:
          break;
      }
    }
  }

  //ROLE CONSDITIONS
  switch (role) {
    case "admin":
      break;

    case "teacher":
      query.lesson = { teacherId: { equals: userId } };
      break;

    case "student":
      query.lesson = {
        class: {
          students: {
            some: {
              id: userId,
            },
          },
        },
      };
      break;

    case "parent":
      query.lesson = {
        class: {
          students: {
            some: {
              parentId: userId,
            },
          },
        },
      };
      break;

    default:
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.assignment.findMany({
      where: query,
      include: {
        lesson: {
          select: {
            subject: { select: { name: true } },
            teacher: { select: { name: true, surname: true } },
            class: { select: { name: true } },
          },
        },
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (pageNumber - 1),
    }),

    prisma.assignment.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white flex-1 m-4 mt-4 roudned-md p-4">
      {/* TOP  */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block font-semibold text-lg">
          All Assigmnents
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
            {(role === "admin" || role === "teacher") && (
              <FormModalContainer table="assignment" type="create" />
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

export default AssignmentsListPage;
