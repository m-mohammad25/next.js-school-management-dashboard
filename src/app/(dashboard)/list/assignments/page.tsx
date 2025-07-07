import { FormModal, Pagination, Table, TableSearch } from "@/components";
import { assignmentsData, role } from "@/lib/data";
import Image from "next/image";

type Assignment = {
  id: number;
  subject: string;
  class: string;
  teacher: string;
  dueDate: string;
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
    header: "Due Date",
    accessor: "dueDate",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

function AssignmentsListPage() {
  const renderRow = (assignment: Assignment) => (
    <tr
      key={assignment.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{assignment.subject}</td>
      <td>{assignment.class}</td>
      <td className="hidden md:table-cell">{assignment.teacher}</td>
      <td className="hidden md:table-cell">{assignment.dueDate}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <FormModal table="assignment" type="delete" id={assignment.id} />
          )}
        </div>
      </td>
    </tr>
  );
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

            <FormModal table="assignment" type="create" />
          </div>
        </div>
      </div>

      {/* LIST */}
      <div>
        <Table columns={columns} renderRow={renderRow} data={assignmentsData} />
      </div>

      {/* Pagination  */}
      <Pagination />
    </div>
  );
}

export default AssignmentsListPage;
