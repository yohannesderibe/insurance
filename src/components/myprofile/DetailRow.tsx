// src/components/Profile/DetailRow.tsx
import React from "react";

interface Props {
  label: string;
  value: string | undefined;
}

const DetailRow: React.FC<Props> = ({ label, value }) => {
  return (
    <div className="flex justify-between py-2 border-b border-gray-200/40">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="text-gray-800">{value ?? "--"}</span>
    </div>
  );
};

export default DetailRow;
