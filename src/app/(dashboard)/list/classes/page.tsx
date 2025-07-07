import { FormModal, Pagination, Table, TableSearch } from "@/components";
import { classesData, role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

type Class = {
  id: number;
  name: string;
  capacity: number;
  grade: number;
  supervisor: string;
};

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
  {
    header: "Actions",
    accessor: "action",
  },
];

function ClassesListPage() {
  const renderRow = (classItem: Class) => (
    <tr
      key={classItem.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{classItem.name}</td>
      <td className="hidden md:table-cell">{classItem.capacity}</td>
      <td className="hidden md:table-cell">{classItem.grade}</td>
      <td className="hidden md:table-cell">{classItem.supervisor}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <FormModal table="class" type="delete" id={classItem.id} />
          )}
        </div>
      </td>
    </tr>
  );
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

            <FormModal table="class" type="create" />
          </div>
        </div>
      </div>

      {/* LIST */}
      <div>
        <Table columns={columns} renderRow={renderRow} data={classesData} />
      </div>

      {/* Pagination  */}
      <Pagination />
    </div>
  );
}

export default ClassesListPage;
