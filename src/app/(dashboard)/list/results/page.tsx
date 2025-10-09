import Image from "next/image";
import FormModalContainer from "@/components/FormModalContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";

import prisma from "@/lib/prisma";
import { Assignment, Exam, Prisma } from "@prisma/client";
import { getUserId, getUserRole } from "@/lib/utils";
import { ITEMS_PER_PAGE } from "@/lib/settings";

type ResultList = {
  resultId: number;
  title: string;
  studentName: string;
  studentSurname: string;
  teacherName: string;
  teacherSurname: string;
  score: number;
  className: string;
  startTime: Date;
};

async function ResultsListPage({
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
      header: "Student",
      accessor: "student",
    },
    {
      header: "Score",
      accessor: "score",
      className: "hidden md:table-cell",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden md:table-cell",
    },
    {
      header: "Class",
      accessor: "class",
      className: "hidden md:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
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

  const renderRow = (result: ResultList) => (
    <tr
      key={result.resultId}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{result.title}</td>
      <td>{result.studentName + " " + result.studentSurname}</td>
      <td className="hidden md:table-cell">{result.score}</td>
      <td className="hidden md:table-cell">
        {result.teacherName + " " + result.teacherSurname}
      </td>
      <td className="hidden md:table-cell">{result.className}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(result.startTime)}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormModalContainer table="result" type="update" data={result} />
              <FormModalContainer
                table="result"
                type="delete"
                id={result.resultId}
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

  const query: Prisma.ResultWhereInput = {};

  for (let [key, value] of Object.entries(queryParams)) {
    if (value != undefined) {
      switch (key) {
        case "studentId":
          query.studentId = value;
          break;

        case "search":
          query.OR = [
            { exam: { title: { contains: value, mode: "insensitive" } } },
            { student: { name: { contains: value, mode: "insensitive" } } },
          ];
          break;
        default:
          break;
      }
    }
  }

  //role conditions
  switch (role) {
    case "admin":
      break;

    case "teacher":
      query.OR = [
        { exam: { lesson: { teacherId: userId } } },
        { assignment: { lesson: { teacherId: userId } } },
      ];
      break;

    case "student":
      query.studentId = userId;
      break;

    case "parent":
      query.student = { parentId: userId };
      break;

    default:
      break;
  }

  const [dataResult, count] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        student: { select: { name: true, surname: true } },
        exam: {
          include: {
            lesson: {
              select: {
                teacher: { select: { name: true, surname: true } },
                class: { select: { name: true } },
              },
            },
          },
        },
        assignment: {
          include: {
            lesson: {
              select: {
                teacher: { select: { name: true, surname: true } },
                class: { select: { name: true } },
              },
            },
          },
        },
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (pageNumber - 1),
    }),

    prisma.result.count({
      where: query,
    }),
  ]);

  const data = dataResult.map((item) => {
    const assessment = item.assignment || item.exam;
    if (!assessment) return null;

    return {
      resultId: item.id,
      examId: item.examId,
      assignmentId: item.assignmentId,
      // type: item.assignment ? "assignment" : "exam",
      title: assessment.title,
      studentId: item.studentId,
      studentName: item.student.name,
      studentSurname: item.student.surname,
      teacherName: assessment.lesson.teacher.name,
      teacherSurname: assessment.lesson.teacher.surname,
      score: item.score,
      className: assessment.lesson.class.name,
      startTime:
        (assessment as Exam).startTime || (assessment as Assignment).startDate,
    };
  });

  return (
    <div className="bg-white flex-1 m-4 mt-4 roudned-md p-4">
      {/* TOP  */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block font-semibold text-lg">All Results</h1>
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
              <FormModalContainer table="result" type="create" />
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

export default ResultsListPage;
