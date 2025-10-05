// import React, { useEffect, useState } from "react";
// import Sidebar from "../../../components/Bars/SideBars/Admin";
// import StatCard from "../../../reusable/UI/StatCard";
// import TrendChart from "../../../reusable/UI/TrendChart";
// import {
//   getDashboardStats,
//   getUserTrends,
// } from "../../../api/Admin/adminDashboardApi";

// const AdminDash: React.FC = () => {
//   const [stats, setStats] = useState<any>(null);
//   const [trends, setTrends] = useState<any>(null);
//   const [selectedRange, setSelectedRange] = useState("Monthly");

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       try {
//         const [dashboardRes, trendsRes] = await Promise.all([
//           getDashboardStats(token),
//           getUserTrends(token),
//         ]);

//         setStats(dashboardRes);
//         setTrends(trendsRes);
//       } catch (err) {
//         console.error("Failed to fetch dashboard data", err);
//       }
//     };
//     fetchData();
//   }, []);

//   // 🧮 Convert trend API data into chart-friendly format
//   const chartData = trends
//     ? [
//         {
//           name: "This Week",
//           clients: trends.clients.addedThisWeek,
//           staff: trends.staff.addedThisWeek,
//         },
//         {
//           name: "This Month",
//           clients: trends.clients.addedThisMonth,
//           staff: trends.staff.addedThisMonth,
//         },
//         {
//           name: "This Year",
//           clients: trends.clients.addedThisYear,
//           staff: trends.staff.addedThisYear,
//         },
//       ]
//     : [];

//   return (
//     <>
//       <style>{`
//         .custom-dashboard-bg {
//           background: linear-gradient(135deg, #fffaf3 0%, #fff4e5 100%);
//         }
//       `}</style>

//       <div className="flex min-h-screen custom-dashboard-bg">
//         <Sidebar open={false} onClose={() => {}} />

//         <main className="flex-1 ml-64 p-8">
//           {/* 🧭 Header */}
//           <header className="mb-6 border-b pb-3 border-yellow-400">
//             <h1 className="text-3xl font-bold text-amber-900">Admin Dashboard</h1>
//             <p className="text-amber-800 mt-1">Welcome to your control center.</p>
//           </header>

//           {/* 🟡 Overview Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             <StatCard title="Total Clients" value={stats?.totalClients ?? 0} />
//             <StatCard title="Total Staff" value={stats?.totalStaff ?? 0} />
//             <StatCard title="Total Operators" value={stats?.totalOperators ?? 0} />
//             <StatCard title="Finance Staff" value={stats?.totalFinanceStaff ?? 0} />
//             <StatCard title="Managers" value={stats?.totalManagers ?? 0} />
//           </div>

//           {/* 🟢 Added Clients & Staff Section */}
//           <div className="mb-10">
//             <h2 className="text-2xl font-semibold text-amber-900 mb-4">
//               Recently Added Users
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
//               {/* Clients */}
//               <StatCard
//                 title="Clients Added This Week"
//                 value={trends?.clients?.addedThisWeek ?? 0}
//                 color="text-green-600"
//               />
//               <StatCard
//                 title="Clients Added This Month"
//                 value={trends?.clients?.addedThisMonth ?? 0}
//                 color="text-green-600"
//               />
//               <StatCard
//                 title="Clients Added This Year"
//                 value={trends?.clients?.addedThisYear ?? 0}
//                 color="text-green-600"
//               />

//               {/* Staff */}
//               <StatCard
//                 title="Staff Added This Week"
//                 value={trends?.staff?.addedThisWeek ?? 0}
//                 color="text-blue-600"
//               />
//               <StatCard
//                 title="Staff Added This Month"
//                 value={trends?.staff?.addedThisMonth ?? 0}
//                 color="text-blue-600"
//               />
//               <StatCard
//                 title="Staff Added This Year"
//                 value={trends?.staff?.addedThisYear ?? 0}
//                 color="text-blue-600"
//               />
//             </div>
//           </div>

//           {/* 🧭 Trends Dropdown */}
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-2xl font-semibold text-amber-900">User Trends</h2>
//             <select
//               value={selectedRange}
//               onChange={(e) => setSelectedRange(e.target.value)}
//               className="border border-amber-300 bg-white rounded-lg px-3 py-2 text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
//             >
//               <option value="Monthly">Monthly</option>
//               <option value="Yearly">Yearly</option>
//             </select>
//           </div>

//           {/* 🧡 Trend Chart */}
//           <TrendChart data={chartData} title={`User Growth (${selectedRange})`} />
//         </main>
//       </div>
//     </>
//   );
// };

// export default AdminDash;
import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Bars/SideBars/Admin";
import StatCard from "../../../reusable/UI/StatCard";
import TrendChart from "../../../reusable/UI/TrendChart";
import { getDashboardStats, getUserTrends } from "../../../api/Admin/adminDashboardApi";

const AdminDash: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [trends, setTrends] = useState<any>(null);
  const [selectedRange, setSelectedRange] = useState("Monthly");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const [dashboardRes, trendsRes] = await Promise.all([
          getDashboardStats(token),
          getUserTrends(token),
        ]);

        setStats(dashboardRes);
        setTrends(trendsRes);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };
    fetchData();
  }, []);

  // 🧮 Convert trend API data into chart-friendly format
  const chartData = trends
    ? [
        {
          name: "This Week",
          clients: trends.clients.addedThisWeek,
          staff: trends.staff.addedThisWeek,
        },
        {
          name: "This Month",
          clients: trends.clients.addedThisMonth,
          staff: trends.staff.addedThisMonth,
        },
        {
          name: "This Year",
          clients: trends.clients.addedThisYear,
          staff: trends.staff.addedThisYear,
        },
      ]
    : [];

  return (
    <>
      <style>{`
        .custom-dashboard-bg {
          background: linear-gradient(135deg, #fffaf3 0%, #fff4e5 100%);
        }
      `}</style>

      <div className="flex min-h-screen custom-dashboard-bg">
        <Sidebar open={false} onClose={() => {}} />

        <main className="flex-1 ml-64 p-8">
          <header className="mb-6 border-b pb-3 border-yellow-400">
            <h1 className="text-3xl font-bold text-amber-900">Admin Dashboard</h1>
            <p className="text-amber-800 mt-1">Welcome to your control center.</p>
          </header>

          {/* 🟡 Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
            <StatCard title="Total Clients" value={stats?.totalClients ?? 0} />
            <StatCard title="Total Staff" value={stats?.totalStaff ?? 0} />
            <StatCard title="Total Operators" value={stats?.totalOperators ?? 0} />
            <StatCard title="Finance Staff" value={stats?.totalFinanceStaff ?? 0} />
            <StatCard title="Managers" value={stats?.totalManagers ?? 0} />
          </div>

          {/* 🟢 Added Clients & Staff Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-amber-900 mb-4">
              Recently Added Users
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {/* Clients */}
              <StatCard
                title="Clients Added This Week"
                value={trends?.clients?.addedThisWeek ?? 0}
                color="green"
              />
              <StatCard
                title="Clients Added This Month"
                value={trends?.clients?.addedThisMonth ?? 0}
                color="green"
              />
              <StatCard
                title="Clients Added This Year"
                value={trends?.clients?.addedThisYear ?? 0}
                color="green"
              />

              {/* Staff */}
              <StatCard
                title="Staff Added This Week"
                value={trends?.staff?.addedThisWeek ?? 0}
                color="blue"
              />
              <StatCard
                title="Staff Added This Month"
                value={trends?.staff?.addedThisMonth ?? 0}
                color="blue"
              />
              <StatCard
                title="Staff Added This Year"
                value={trends?.staff?.addedThisYear ?? 0}
                color="blue"
              />
            </div>
          </div>

          {/* 🧭 Trends Dropdown */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-amber-900">User Trends</h2>
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="border border-amber-300 bg-white rounded-lg px-3 py-2 text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>

          {/* 🧡 Trend Chart */}
          <TrendChart
            data={chartData}
            title={`User Growth (${selectedRange})`}
          />
        </main>
      </div>
    </>
  );
};

export default AdminDash;
