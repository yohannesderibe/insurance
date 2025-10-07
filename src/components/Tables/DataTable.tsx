// src/components/Tables/DataTable.tsx
import React from "react";

// Export the Column interface FIRST, before the component
export interface Column {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  emptyMessage?: string;
  onSort?: (column: string, direction: "asc" | "desc") => void;
  onRowClick?: (row: any) => void;
  rowActions?: (row: any) => React.ReactNode;
  striped?: boolean;
  hover?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  loading = false,
  emptyMessage = "No data found",
  onSort,
  onRowClick,
  rowActions,
  striped = true,
  hover = true,
}) => {
  const [sortColumn, setSortColumn] = React.useState<string>("");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  const handleSort = (column: string) => {
    if (!onSort) return;

    let direction: "asc" | "desc" = "asc";
    if (sortColumn === column) {
      direction = sortDirection === "asc" ? "desc" : "asc";
    }
    
    setSortColumn(column);
    setSortDirection(direction);
    onSort(column, direction);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-amber-200 overflow-hidden">
      <table className="min-w-full divide-y divide-amber-200">
        <thead className="bg-gradient-to-r from-amber-50 to-yellow-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`py-4 px-6 text-xs font-semibold text-amber-800 uppercase tracking-wider ${
                  column.align === "center" ? "text-center" : 
                  column.align === "right" ? "text-right" : "text-left"
                } ${column.sortable ? "cursor-pointer hover:bg-amber-100" : ""}`}
                onClick={() => column.sortable && handleSort(column.key)}
                style={{ width: column.width }}
              >
                <div className={`flex items-center ${
                  column.align === "center" ? "justify-center" : 
                  column.align === "right" ? "justify-end" : "justify-start"
                }`}>
                  {column.header}
                  {column.sortable && sortColumn === column.key && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
            ))}
            {rowActions && (
              <th className="py-4 px-6 text-center text-xs font-semibold text-amber-800 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-amber-100">
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length + (rowActions ? 1 : 0)} 
                className="py-12 px-6 text-center"
              >
                <div className="text-amber-400 text-6xl mb-4">📊</div>
                <h3 className="text-lg font-semibold text-amber-800 mb-2">
                  {emptyMessage}
                </h3>
                <p className="text-amber-600">No records to display</p>
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={row.id || index}
                className={`
                  ${striped && index % 2 === 0 ? "bg-amber-50/30" : "bg-white"}
                  ${hover ? "hover:bg-amber-50" : ""}
                  ${onRowClick ? "cursor-pointer" : ""}
                  transition-colors
                `}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`py-4 px-6 text-sm ${
                      column.align === "center" ? "text-center" : 
                      column.align === "right" ? "text-right" : "text-left"
                    } ${
                      column.key === 'email' ? 'text-amber-900' :
                      column.key === 'name' ? 'font-medium text-amber-900' :
                      'text-amber-700'
                    }`}
                  >
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key] || "-"
                    }
                  </td>
                ))}
                {rowActions && (
                  <td className="py-4 px-6">
                    <div className="flex justify-center gap-2">
                      {rowActions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Or you can export everything at the bottom like this:
export default DataTable;
export type { Column };