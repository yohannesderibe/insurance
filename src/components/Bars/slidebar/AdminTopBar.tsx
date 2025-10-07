// src/reusable/UI/AdminTopBar.tsx
import React from "react";

interface AdminTopBarProps {
  title: string;
  subtitle?: string;
}

const AdminTopBar: React.FC<AdminTopBarProps> = ({ title, subtitle }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6 rounded-2xl shadow-lg mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && <p className="text-blue-100 mt-1">{subtitle}</p>}
    </div>
  );
};

export default AdminTopBar;