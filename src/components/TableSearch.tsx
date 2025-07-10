"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

function TableSearch() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searhQuery = (e.currentTarget[0] as HTMLInputElement).value;

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("search", searhQuery.toString());
    router.push(`${window.location.pathname}?${searchParams}`);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full md:w-auto  flex items-center gap-2 text-xs ring-[1.5px] ring-gray-300 px-2 rounded-full"
    >
      <Image src="/search.png" alt="logo" width={14} height={14} />
      <input
        type="text"
        placeholder="Search..."
        className="outline-none p-2 bg-transparent w-[200px]"
      />
    </form>
  );
}

export default TableSearch;
