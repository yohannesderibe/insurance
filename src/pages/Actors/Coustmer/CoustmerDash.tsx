import React from "react";
import Sidebar from "../../../components/Bars/SideBars/Customer"; // adjust path to your Sidebar.tsx
import TopBar  from "../../../components/Bars/TopBar";
const CoustmerDash: React.FC = () => {
  return (
    <div className="flex">
      
      {/* Sidebar */}
      <Sidebar open={false} onClose={() => {}} />

      {/* Main content */}
      <main className="flex-1 ml-64 p-6"> 
        <TopBar  className="flex ml-64 "/>
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
