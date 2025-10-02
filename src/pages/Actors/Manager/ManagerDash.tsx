import React from "react";
import Sidebar from "../../../components/Bars/SideBars/Manager"; // adjust path to your Sidebar.tsx


const ManagerDash: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar open={false} onClose={() => {}} />
<main className="flex-1 ml-64 p-6" >

        <h1 className="text-2xl font-bold mb-4 bg-cyan-800">Manager Dashboard</h1>
        <p className="text-cyan-400">Welcome to the Manager dashboard!</p>
        {/* Add admin-specific components and functionality here */}
    </main>
    </div>
  );
}

export default ManagerDash;