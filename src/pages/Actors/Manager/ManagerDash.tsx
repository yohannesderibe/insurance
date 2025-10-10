import React, { useState } from "react";
import Sidebar from "../../../components/Bars/SideBars/Manager";

const ManagerDash: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarCollapse = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        open={false} 
        onClose={() => {}} 
        onCollapse={handleSidebarCollapse}
      />
      
      <main className={`flex-1 transition-all duration-300 ${
        isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
      } p-6`}>
        <h1 className="text-2xl font-bold mb-4 bg-cyan-800">Manager Dashboard</h1>
        <p className="text-cyan-400">Welcome to the Manager dashboard!</p>
        {/* Add admin-specific components and functionality here */}
      </main>
    </div>
  );
}

export default ManagerDash;