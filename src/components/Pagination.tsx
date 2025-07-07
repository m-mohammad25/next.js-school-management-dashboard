function Pagination() {
  return (
    <div className="flex p-4 items-center justify-between text-gray-500">
      <button
        disabled
        className="px-4 py-2 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>
      <div className="flex items-center gap-2 text-sm">
        <button className="px-2 rounded-md bg-lamaSky">1</button>
        <button className="px-2 rounded-md">2</button>
        <button className="px-2 rounded-md">3</button>
        ...
        <button className="px-2 rounded-md ">10</button>
      </div>

      <button className="px-4 py-2 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
        Next
      </button>
    </div>
  );
}

export default Pagination;
