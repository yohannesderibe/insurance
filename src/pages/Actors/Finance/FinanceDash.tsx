import React from "react";
import Sidebar from "../../../components/Bars/SideBars/Finance"; // adjust path to your Sidebar.tsx

const FinanceDash: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar open={false} onClose={() => {}} />
<main className="flex-1 ml-64 p-6" >
        <h1 className="text-2xl font-bold mb-4 bg-green-900">Finance Dashboard</h1>
        <p className="text-green-400">Welcome to the Finance dashboard!</p>
        {/* Add admin-specific components and functionality here */}
    </main>
    </div>
  );
}

export default FinanceDash;