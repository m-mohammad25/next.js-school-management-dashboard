import { FormModal, Pagination, Table, TableSearch } from "@/components";
import { announcementsData, role } from "@/lib/data";
import Image from "next/image";

type Announcement = {
  id: number;
  title: string;
  class: string;
  date: string;
};

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
  {
    header: "Actions",
    accessor: "action",
  },
];

function AnnouncementsListPage() {
  const renderRow = (announcement: Announcement) => (
    <tr
      key={announcement.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{announcement.title}</td>
      <td>{announcement.class}</td>
      <td className="hidden md:table-cell">{announcement.date}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal
                table="announcement"
                type="update"
                data={announcement}
              />
              <FormModal
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

            <FormModal table="announcement" type="create" />
          </div>
        </div>
      </div>

      {/* LIST */}
      <div>
        <Table
          columns={columns}
          renderRow={renderRow}
          data={announcementsData}
        />
      </div>

      {/* Pagination  */}
      <Pagination />
    </div>
  );
}

export default AnnouncementsListPage;
