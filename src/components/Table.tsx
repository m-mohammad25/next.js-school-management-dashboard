type TableProps = {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
};
function Table({ columns, renderRow, data }: TableProps) {
  return (
    <table className="w-full mt-4">
      <tr className="text-left text-gray-500 text-sm">
        {columns.map((col) => (
          <th key={col.accessor} className={col.className}>
            {col.header}
          </th>
        ))}
      </tr>
      {data.map((item) => renderRow(item))}
    </table>
  );
}

export default Table;
