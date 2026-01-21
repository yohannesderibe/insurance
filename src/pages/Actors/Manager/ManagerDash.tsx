import React, { useState } from "react";
// import Sidebar from "../../../components/Bars/SideBars/Manager";

const ManagerDash: React.FC = () => {



  return (
    <div className="flex min-h-screen">


      <main className={`flex-1 transition-all duration-300 p-6`}>
        <h1 className="text-2xl font-bold mb-4 bg-amber-800 bg-clip-text text-transparent">Manager Dashboard</h1>
        <p className="text-amber-700">Welcome to the Manager dashboard!</p>
        {/* Add admin-specific components and functionality here */}
      </main>
    </div>
  );
}

export default ManagerDash;