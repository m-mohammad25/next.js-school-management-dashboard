import { FormModal, Pagination, Table, TableSearch } from "@/components";
import { role, teachersData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

type Teacher = {
  id: number;
  teacherId: string;
  name: string;
  email?: string;
  photo: string;
  phone: string;
  subjects: string[];
  classes: string[];
  address: string;
};

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
  {
    header: "Actions",
    accessor: "action",
  },
];
function TeachersListPage() {
  const renderRow = (teacher: Teacher) => (
    <tr
      key={teacher.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center p-4 gap-4">
        <Image
          src={teacher.photo}
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

      <td className="hidden md:table-cell">{teacher.teacherId}</td>
      <td className="hidden md:table-cell">{teacher.subjects.join(",")}</td>
      <td className="hidden md:table-cell">{teacher.classes.join(",")}</td>
      <td className="hidden md:table-cell">{teacher.phone}</td>
      <td className="hidden md:table-cell">{teacher.address}</td>

      <td className="flex items-center gap-2">
        <Link href={`teachers/${teacher.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
            <Image src="/view.png" alt="edit" width={16} height={16} />
          </button>
        </Link>

        {role == "admin" && (
          <FormModal table="teacher" type="delete" id={teacher.id} />
        )}
      </td>
    </tr>
  );
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
            <FormModal table="teacher" type="create" />
          </div>
        </div>
      </div>

      {/* LIST */}
      <div>
        <Table columns={columns} renderRow={renderRow} data={teachersData} />
      </div>

      {/* Pagination  */}
      <Pagination />
    </div>
  );
}

export default TeachersListPage;
