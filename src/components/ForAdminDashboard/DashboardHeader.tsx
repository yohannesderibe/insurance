import React from "react";
import { TrendingUp } from "lucide-react";

const DashboardHeader: React.FC = () => {
  return (
    <header className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-900 to-amber-700 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-amber-800 mt-2 text-lg">Welcome to your control center</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-amber-700">
            <TrendingUp className="w-5 h-5" />
            <span>Live Data</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;