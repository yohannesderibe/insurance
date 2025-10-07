// src/components/table/table.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface Column {
  label: string;
  key: string;
  align?: "left" | "center" | "right";
}

interface ReusableTableProps {
  columns: Column[];
  data: any[];
  renderRow: (row: any, index: number) => React.ReactNode;
  stickyLastColumn?: boolean;
}

const ReusableTable: React.FC<ReusableTableProps> = ({ 
  columns, 
  data, 
  renderRow,
  stickyLastColumn = false 
}) => {
  return (
    <TableContainer component={Paper} className="rounded-xl shadow-sm">
      <Table>
        <TableHead className="bg-gray-100">
          <TableRow>
            {columns.map((col, index) => (
              <TableCell 
                key={index} 
                align={col.align || "left"} 
                className={`font-semibold text-sm text-gray-600 ${
                  stickyLastColumn && index === columns.length - 1 ? 'sticky-header-cell' : ''
                }`}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>{data.map((row, index) => renderRow(row, index))}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReusableTable;