import { FormModal, Pagination, Table, TableSearch } from "@/components";
import { role, studentsData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

type Student = {
  id: number;
  studentId: string;
  name: string;
  email?: string;
  photo: string;
  phone?: string;
  grade: number;
  class: string;
  address: string;
};

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
  {
    header: "Actions",
    accessor: "action",
  },
];
function StudentsListsPage() {
  const renderRow = (student: Student) => (
    <tr
      key={student.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center p-4 gap-4">
        <Image
          src={student.photo}
          alt="teacher image"
          width={40}
          height={40}
          className="rounded-full object-cover md:hidden xl:block w-10 h-10"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{student.name}</h3>
          <p className="text-xs to-gray-500">{student.class}</p>
        </div>
      </td>

      <td className="hidden md:table-cell">{student.studentId}</td>
      <td className="hidden md:table-cell">{student.grade}</td>
      <td className="hidden md:table-cell">{student.phone}</td>
      <td className="hidden md:table-cell">{student.address}</td>

      <td className="flex items-center gap-2">
        <Link href={`${student.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
            <Image src="/view.png" alt="view" width={16} height={16} />
          </button>
        </Link>

        {role == "admin" && (
          <FormModal table="student" type="delete" id={student.id} />
        )}
      </td>
    </tr>
  );
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

            <FormModal table="student" type="create" />
          </div>
        </div>
      </div>

      {/* LIST */}
      <div>
        <Table columns={columns} renderRow={renderRow} data={studentsData} />
      </div>

      {/* Pagination  */}
      <Pagination />
    </div>
  );
}

export default StudentsListsPage;
