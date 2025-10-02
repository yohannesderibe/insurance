import React from "react";
import Sidebar from "../../../components/Bars/SideBars/Operating"; // adjust path to your Sidebar.tsx

const OpDash: React.FC = () => {
  return (
    <div className="flex">
<Sidebar open={false} onClose={() => {}} />
<main className="flex-1 ml-64 p-6" >
        <h1 className="text-2xl font-bold mb-4 bg-red-900">operating officer Dashboard</h1>
        <p className="text-red-900">Welcome to the Operating officer dashboard!</p>
        {/* Add admin-specific components and functionality here */}
   </main>
    </div>
  );
}

export default OpDash;