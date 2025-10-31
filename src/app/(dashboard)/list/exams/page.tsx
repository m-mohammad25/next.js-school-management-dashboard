import FormModalContainer from "@/components/FormModalContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { examsData, role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { getUserId, getUserRole } from "@/lib/utils";
import { Class, Exam, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";

type ExamList = Exam & {
  lesson: {
    subject: Subject;
    teacher: Teacher;
    class: Class;
  };
};

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
    header: "Date",
    accessor: "date",
    className: "hidden md:table-cell",
  },
  ...(role === "admin" || role === "teacher" || role === "guest"
    ? [
        {
          header: "Actions",
          accessor: "action",
        },
      ]
    : []),
];

const renderRow = (exam: ExamList) => (
  <tr
    key={exam.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
  >
    <td className="flex items-center gap-4 p-4">{exam.lesson.subject.name}</td>
    <td>{exam.lesson.class.name}</td>
    <td className="hidden md:table-cell">{`${exam.lesson.teacher.name} ${exam.lesson.teacher.surname}`}</td>
    <td className="hidden md:table-cell">
      {new Intl.DateTimeFormat("en-US").format(exam.startTime)}
    </td>
    <td>
      <div className="flex items-center gap-2">
        {(role === "admin" || role === "teacher" || role === "guest") && (
          <>
            <FormModalContainer table="exam" type="update" data={exam} />
            <FormModalContainer table="exam" type="delete" id={exam.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);

async function ExamsListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const role = await getUserRole();
  const userId = await getUserId();

  const { page, ...queryParams } = searchParams;

  const pageNumber = page ? parseInt(page) : 1;

  // URL Query Params Condition

  const query: Prisma.ExamWhereInput = {};
  query.lesson = {};

  for (let [key, value] of Object.entries(queryParams)) {
    if (value != undefined) {
      switch (key) {
        case "teacherId":
          query.lesson.teacherId = value;
          break;

        case "classId":
          query.lesson.classId = parseInt(value);
          break;

        case "search":
          query.lesson.subject = {
            name: { contains: value, mode: "insensitive" },
          };
          break;

        default:
          break;
      }
    }
  }

  // Role Conditions

  const roleConditions = {
    teacher: { teacherId: userId! },
    student: { class: { students: { some: { id: userId! } } } },
    parent: { class: { students: { some: { parentId: userId! } } } },
  };

  query.lesson = roleConditions[role as keyof typeof roleConditions];

  const [data, count] = await prisma.$transaction([
    prisma.exam.findMany({
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

    prisma.exam.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white flex-1 m-4 mt-4 roudned-md p-4">
      {/* TOP  */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block font-semibold text-lg">All Exams</h1>
        <div className="flex flex-col md:flex-row items-center w-full md:w-auto gap-4">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="filter" width={14} height={14} />
            </button>

            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="filter" width={14} height={14} />
            </button>

            {(role === "admin" || role === "teacher" || role === "guest") && (
              <FormModalContainer table="exam" type="create" />
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

export default ExamsListPage;
