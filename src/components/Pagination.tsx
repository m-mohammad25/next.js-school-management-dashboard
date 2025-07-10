"use client";

import { ITEMS_PER_PAGE } from "@/lib/settings";
import { useRouter } from "next/navigation";

type PaginationProps = {
  pageNumber: number;
  count: number;
};
function Pagination({ pageNumber, count }: PaginationProps) {
  const router = useRouter();

  const hasPrev = ITEMS_PER_PAGE * (pageNumber - 1) > 0;
  const hasNext = ITEMS_PER_PAGE * pageNumber < count;

  const handleChangePage = (newPage: number) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${searchParams}`);
  };
  return (
    <div className="flex p-4 items-center justify-between text-gray-500">
      <button
        disabled={!hasPrev}
        className="px-4 py-2 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => handleChangePage(pageNumber - 1)}
      >
        Prev
      </button>
      <div className="flex items-center gap-2 text-sm">
        {Array.from(
          { length: Math.ceil(count / ITEMS_PER_PAGE) },
          (_, index) => {
            const pageIndex = index + 1;
            return (
              <button
                key={index}
                className={`px-2 rounded-md ${
                  pageIndex === pageNumber ? "bg-lamaSky" : ""
                } `}
                onClick={() => handleChangePage(pageIndex)}
              >
                {pageIndex}
              </button>
            );
          }
        )}
      </div>

      <button
        disabled={!hasNext}
        onClick={() => handleChangePage(pageNumber + 1)}
        className="px-4 py-2 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
