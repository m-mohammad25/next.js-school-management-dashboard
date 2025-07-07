import Image from "next/image";

function TableSearch() {
  return (
    <div className="w-full md:w-auto  flex items-center gap-2 text-xs ring-[1.5px] ring-gray-300 px-2 rounded-full">
      <Image src="/search.png" alt="logo" width={14} height={14} />
      <input
        type="text"
        placeholder="Search..."
        className="outline-none p-2 bg-transparent w-[200px]"
      />
    </div>
  );
}

export default TableSearch;
