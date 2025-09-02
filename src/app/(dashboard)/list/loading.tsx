function Loading() {
  const actionButtonPlaceholders = [...Array(3)];
  const tableRowPlaceholders = [...Array(5)];
  const paginationBtnsPlaceholders = [...Array(5)];

  return (
    <div className="flex-1 m-4 mt-4 rounded-md p-4 bg-white animate-pulse">
      {/* TOP - Header and Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        {/* Title Placeholder */}
        <div className="w-48 h-8 bg-gray-200 rounded-md"></div>

        {/* Search and Buttons Placeholder */}
        <div className="flex flex-col md:flex-row items-center w-full md:w-auto gap-4 mt-4 md:mt-0">
          {/* Table Search Placeholder */}
          <div className="w-full md:w-64 h-10 bg-gray-200 rounded-md"></div>
          {/* Action Buttons Placeholder */}
          <div className="flex items-center gap-4 self-end">
            {actionButtonPlaceholders.map((_, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded-full bg-gray-200"
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* LIST - Table Placeholder */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="w-16 h-4 bg-gray-200 rounded-md"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                <div className="w-24 h-4 bg-gray-200 rounded-md"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                <div className="w-24 h-4 bg-gray-200 rounded-md"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                <div className="w-24 h-4 bg-gray-200 rounded-md"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                <div className="w-20 h-4 bg-gray-200 rounded-md"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                <div className="w-24 h-4 bg-gray-200 rounded-md"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="w-16 h-4 bg-gray-200 rounded-md"></div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Table Rows Placeholder */}
            {tableRowPlaceholders.map((_, index) => (
              <tr key={index} className="even:bg-slate-50">
                <td className="p-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200"></div>
                    <div className="ml-4">
                      <div className="w-32 h-4 bg-gray-200 rounded-md mb-1"></div>
                      <div className="w-48 h-3 bg-gray-200 rounded-md"></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="w-20 h-4 bg-gray-200 rounded-md"></div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="w-24 h-4 bg-gray-200 rounded-md"></div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="w-24 h-4 bg-gray-200 rounded-md"></div>
                </td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  <div className="w-20 h-4 bg-gray-200 rounded-md"></div>
                </td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  <div className="w-24 h-4 bg-gray-200 rounded-md"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-gray-200"></div>
                    <div className="w-7 h-7 rounded-full bg-gray-200"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Placeholder */}
      <div className="flex justify-center items-center mt-8 gap-3">
        {paginationBtnsPlaceholders.map((_, index) => (
          <div key={index} className="px-2 rounded-md bg-gray-200">
            &nbsp;
          </div>
        ))}
      </div>
    </div>
  );
}

export default Loading;
