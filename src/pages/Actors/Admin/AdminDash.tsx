import React from "react";
import Sidebar from "../../../components/Bars/SideBars/Admin"; // adjust path to your Sidebar.tsx

const AdminDash: React.FC = () => {
  return (
    <div className="flex">
<Sidebar open={false} onClose={() => {}} />
  <main className="flex-1 ml-64 p-6" >
        <h1 className="text-2xl font-bold mb-4 bg-blue-900">Admin Dashboard</h1>
        <p className="text-blue-600">Welcome to the admin dashboard!</p>
        {/* Add admin-specific components and functionality here */}
   </main>
    </div>
    
  );
}

export default AdminDash;