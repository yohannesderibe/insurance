import React, { useState } from "react";
import Sidebar from "../../../components/Bars/SideBars/Allside";
import TopBar from "../../../components/Bars/TopBar";

const CoustmerDash: React.FC = () => {
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
        <TopBar />
        <h1 className="text-2xl font-bold mb-4 bg-amber-600">
          Customer Dashboard
        </h1>
        <p className="text-amber-400">
          Welcome to the Customer dashboard!
        </p>
      </main>
    </div>
  );
};

export default CoustmerDash;