import React, { useState } from "react";
import Sidebar from "../../../components/Bars/SideBars/Finance";

const FinanceDash: React.FC = () => {
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
        <h1 className="text-2xl font-bold mb-4">Finance Dashboard</h1>
        <p className="text-green-600">Welcome to the Finance dashboard!</p>
        {/* Add finance-specific components here */}
      </main>
    </div>
  );
};

export default FinanceDash;