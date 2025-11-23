import React, { useState } from "react";

const FinanceDash: React.FC = () => {



  return (
    <div className="flex min-h-screen">
 
      
      <main className={`flex-1 transition-all duration-300 
       p-6`}>
        <h1 className="text-2xl font-bold mb-4">Finance Dashboard</h1>
        <p className="text-green-600">Welcome to the Finance dashboard!</p>
        {/* Add finance-specific components here */}
      </main>
    </div>
  );
};

export default FinanceDash;