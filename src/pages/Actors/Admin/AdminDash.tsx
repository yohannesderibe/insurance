// import React, { useEffect, useState } from "react";
// import TrendChart from "../../../reusable/UI/TrendChart";
// import { getDashboardStats, getUserTrends } from "../../../api/Admin/adminDashboardApi";
// import { 
//   Users, 
//   UserCheck, 
//   UserCog, 
//   UserPlus, 
//   TrendingUp,
//   Building,
//   Briefcase,
//   ArrowUpRight,
//   ArrowDownRight
// } from "lucide-react";

// const AdminDash: React.FC = () => {
//   const [stats, setStats] = useState<any>(null);
//   const [trends, setTrends] = useState<any>(null);
//   const [selectedRange, setSelectedRange] = useState("Monthly");

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      
//       if (!token) {
//         console.error('❌ No authentication token found in localStorage');
//         return;
//       }

//       console.log('🔑 Token found, fetching data...');

//       try {
//         const [dashboardRes, trendsRes] = await Promise.all([
//           getDashboardStats(),
//           new Promise(resolve => setTimeout(() => resolve(getUserTrends()), 100))
//         ]);

//         console.log('✅ Data fetched successfully');
        
//         setStats(dashboardRes);
//         setTrends(trendsRes);
//       } catch (err) {
//         console.error("❌ Failed to fetch dashboard data", err);
//       }
//     };
    
//     fetchData();
//   }, []);

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

//   const statIcons = {
//     clients: <Users className="w-6 h-6" />,
//     staff: <UserCheck className="w-6 h-6" />,
//     operators: <UserCog className="w-6 h-6" />,
//     finance: <Briefcase className="w-6 h-6" />,
//     managers: <Building className="w-6 h-6" />
//   };

//   return (
//     <>
//       <style>{`
//         .custom-dashboard-bg {
//           background: linear-gradient(135deg, #fffaf3 0%, #fff4e5 100%);
//         }
//         .glass-card {
//           background: rgba(255, 255, 255, 0.9);
//           backdrop-filter: blur(10px);
//           border: 1px solid rgba(255, 237, 213, 0.3);
//         }
//         .gradient-border {
//           background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
//           padding: 1px;
//           border-radius: 12px;
//         }
//         .honey-gradient {
//           background: linear-gradient(135deg, #fef3c7 0%, #fef7ed 100%);
//         }
//       `}</style>

//       <div className="custom-dashboard-bg min-h-screen rounded-xl p-6">
//         {/* 🧭 Header */}
//         <header className="mb-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-900 to-amber-700 bg-clip-text text-transparent">
//                 Admin Dashboard
//               </h1>
//               <p className="text-amber-800 mt-2 text-lg">Welcome to your control center</p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2 text-amber-700">
//                 <TrendingUp className="w-5 h-5" />
//                 <span>Live Data</span>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* 🟡 Overview Cards */}
//         <section className="mb-10">
//           <h2 className="text-2xl font-semibold text-amber-900 mb-6 flex items-center">
//             <Users className="w-6 h-6 mr-2" />
//             Overview
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
//             <div className="gradient-border">
//               <div className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300 honey-gradient">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
//                     {statIcons.clients}
//                   </div>
//                   <div className={`flex items-center text-sm font-medium ${stats?.totalClients > 0 ? 'text-green-600' : 'text-amber-600'}`}>
//                     {stats?.totalClients > 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
//                     Active
//                   </div>
//                 </div>
//                 <h3 className="text-3xl font-bold text-amber-900 mb-2">{stats?.totalClients ?? 0}</h3>
//                 <p className="text-amber-700 text-sm">Total Clients</p>
//               </div>
//             </div>

//             <div className="gradient-border">
//               <div className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300 honey-gradient">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
//                     {statIcons.staff}
//                   </div>
//                   <div className={`flex items-center text-sm font-medium ${stats?.totalStaff > 0 ? 'text-green-600' : 'text-amber-600'}`}>
//                     {stats?.totalStaff > 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
//                     Active
//                   </div>
//                 </div>
//                 <h3 className="text-3xl font-bold text-amber-900 mb-2">{stats?.totalStaff ?? 0}</h3>
//                 <p className="text-amber-700 text-sm">Total Staff</p>
//               </div>
//             </div>

//             <div className="gradient-border">
//               <div className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300 honey-gradient">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
//                     {statIcons.operators}
//                   </div>
//                   <div className={`flex items-center text-sm font-medium ${stats?.totalOperators > 0 ? 'text-green-600' : 'text-amber-600'}`}>
//                     {stats?.totalOperators > 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
//                     Active
//                   </div>
//                 </div>
//                 <h3 className="text-3xl font-bold text-amber-900 mb-2">{stats?.totalOperators ?? 0}</h3>
//                 <p className="text-amber-700 text-sm">Operators</p>
//               </div>
//             </div>

//             <div className="gradient-border">
//               <div className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300 honey-gradient">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
//                     {statIcons.finance}
//                   </div>
//                   <div className={`flex items-center text-sm font-medium ${stats?.totalFinanceStaff > 0 ? 'text-green-600' : 'text-amber-600'}`}>
//                     {stats?.totalFinanceStaff > 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
//                     Active
//                   </div>
//                 </div>
//                 <h3 className="text-3xl font-bold text-amber-900 mb-2">{stats?.totalFinanceStaff ?? 0}</h3>
//                 <p className="text-amber-700 text-sm">Finance Staff</p>
//               </div>
//             </div>

//             <div className="gradient-border">
//               <div className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300 honey-gradient">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
//                     {statIcons.managers}
//                   </div>
//                   <div className={`flex items-center text-sm font-medium ${stats?.totalManagers > 0 ? 'text-green-600' : 'text-amber-600'}`}>
//                     {stats?.totalManagers > 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
//                     Active
//                   </div>
//                 </div>
//                 <h3 className="text-3xl font-bold text-amber-900 mb-2">{stats?.totalManagers ?? 0}</h3>
//                 <p className="text-amber-700 text-sm">Managers</p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* 🟢 Added Clients & Staff Section */}
//         <section className="mb-10">
//           <h2 className="text-2xl font-semibold text-amber-900 mb-6 flex items-center">
//             <UserPlus className="w-6 h-6 mr-2" />
//             Recently Added Users
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//             {/* Clients Section */}
//             <div className="col-span-1 md:col-span-2 lg:col-span-3">
//               <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center">
//                 <Users className="w-5 h-5 mr-2 text-green-600" />
//                 Clients
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="glass-card rounded-2xl p-6 border-l-4 border-green-400 hover:shadow-lg transition-all duration-300 honey-gradient">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="p-2 bg-green-50 rounded-lg">
//                       <Users className="w-5 h-5 text-green-600" />
//                     </div>
//                     <div className="flex items-center text-green-600 text-sm font-medium">
//                       <TrendingUp className="w-4 h-4 mr-1" />
//                       New
//                     </div>
//                   </div>
//                   <h4 className="text-2xl font-bold text-amber-900 mb-1">{trends?.clients?.addedThisWeek ?? 0}</h4>
//                   <p className="text-amber-700 text-sm">This Week</p>
//                 </div>

//                 <div className="glass-card rounded-2xl p-6 border-l-4 border-green-500 hover:shadow-lg transition-all duration-300 honey-gradient">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="p-2 bg-green-50 rounded-lg">
//                       <Users className="w-5 h-5 text-green-600" />
//                     </div>
//                     <div className="flex items-center text-green-600 text-sm font-medium">
//                       <TrendingUp className="w-4 h-4 mr-1" />
//                       Growth
//                     </div>
//                   </div>
//                   <h4 className="text-2xl font-bold text-amber-900 mb-1">{trends?.clients?.addedThisMonth ?? 0}</h4>
//                   <p className="text-amber-700 text-sm">This Month</p>
//                 </div>

//                 <div className="glass-card rounded-2xl p-6 border-l-4 border-green-600 hover:shadow-lg transition-all duration-300 honey-gradient">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="p-2 bg-green-50 rounded-lg">
//                       <Users className="w-5 h-5 text-green-600" />
//                     </div>
//                     <div className="flex items-center text-green-600 text-sm font-medium">
//                       <TrendingUp className="w-4 h-4 mr-1" />
//                       Total
//                     </div>
//                   </div>
//                   <h4 className="text-2xl font-bold text-amber-900 mb-1">{trends?.clients?.addedThisYear ?? 0}</h4>
//                   <p className="text-amber-700 text-sm">This Year</p>
//                 </div>
//               </div>
//             </div>

//             {/* Staff Section */}
//             <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-6">
//               <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center">
//                 <UserCheck className="w-5 h-5 mr-2 text-blue-600" />
//                 Staff Members
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="glass-card rounded-2xl p-6 border-l-4 border-blue-400 hover:shadow-lg transition-all duration-300 honey-gradient">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="p-2 bg-blue-50 rounded-lg">
//                       <UserCheck className="w-5 h-5 text-blue-600" />
//                     </div>
//                     <div className="flex items-center text-blue-600 text-sm font-medium">
//                       <TrendingUp className="w-4 h-4 mr-1" />
//                       New
//                     </div>
//                   </div>
//                   <h4 className="text-2xl font-bold text-amber-900 mb-1">{trends?.staff?.addedThisWeek ?? 0}</h4>
//                   <p className="text-amber-700 text-sm">This Week</p>
//                 </div>

//                 <div className="glass-card rounded-2xl p-6 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300 honey-gradient">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="p-2 bg-blue-50 rounded-lg">
//                       <UserCheck className="w-5 h-5 text-blue-600" />
//                     </div>
//                     <div className="flex items-center text-blue-600 text-sm font-medium">
//                       <TrendingUp className="w-4 h-4 mr-1" />
//                       Growth
//                     </div>
//                   </div>
//                   <h4 className="text-2xl font-bold text-amber-900 mb-1">{trends?.staff?.addedThisMonth ?? 0}</h4>
//                   <p className="text-amber-700 text-sm">This Month</p>
//                 </div>

//                 <div className="glass-card rounded-2xl p-6 border-l-4 border-blue-600 hover:shadow-lg transition-all duration-300 honey-gradient">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="p-2 bg-blue-50 rounded-lg">
//                       <UserCheck className="w-5 h-5 text-blue-600" />
//                     </div>
//                     <div className="flex items-center text-blue-600 text-sm font-medium">
//                       <TrendingUp className="w-4 h-4 mr-1" />
//                       Total
//                     </div>
//                   </div>
//                   <h4 className="text-2xl font-bold text-amber-900 mb-1">{trends?.staff?.addedThisYear ?? 0}</h4>
//                   <p className="text-amber-700 text-sm">This Year</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* 📈 Trends Section */}
//         <section>
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-semibold text-amber-900 flex items-center">
//               <TrendingUp className="w-6 h-6 mr-2" />
//               User Trends
//             </h2>
//             <select
//               value={selectedRange}
//               onChange={(e) => setSelectedRange(e.target.value)}
//               className="glass-card border border-amber-200 rounded-xl px-4 py-2 text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent honey-gradient"
//             >
//               <option value="Monthly">Monthly View</option>
//               <option value="Yearly">Yearly View</option>
//             </select>
//           </div>

//           {/* Trend Chart */}
//           <div className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300 honey-gradient">
//             <TrendChart
//               data={chartData}
//               title={`User Growth (${selectedRange})`}
//             />
//           </div>
//         </section>
//       </div>
//     </>
//   );
// };

// export default AdminDash;
import React, { useEffect, useState } from "react";
import { getDashboardStats, getUserTrends } from "../../../api/Admin/adminDashboardApi";
import DashboardHeader from "../../../components/ForAdminDashboard/DashboardHeader";
import OverviewSection from "../../../components/ForAdminDashboard/OverviewSection";
import RecentUsersSection from "../../../components/ForAdminDashboard/RecentUsersSection";
import TrendsSection from "../../../reusable/UI/TrendChart";

const AdminDash: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [trends, setTrends] = useState<any>(null);
  const [selectedRange, setSelectedRange] = useState("Monthly");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      
      if (!token) {
        console.error('❌ No authentication token found in localStorage');
        return;
      }

      console.log('🔑 Token found, fetching data...');

      try {
        const [dashboardRes, trendsRes] = await Promise.all([
          getDashboardStats(),
          new Promise(resolve => setTimeout(() => resolve(getUserTrends()), 100))
        ]);

        console.log('✅ Data fetched successfully');
        
        setStats(dashboardRes);
        setTrends(trendsRes);
      } catch (err) {
        console.error("❌ Failed to fetch dashboard data", err);
      }
    };
    
    fetchData();
  }, []);

  return (
    <>
      <DashboardStyles />
      <div className="custom-dashboard-bg min-h-screen rounded-xl p-6">
        <DashboardHeader />
        <OverviewSection stats={stats} />
        <RecentUsersSection trends={trends} />
        <TrendsSection 
          trends={trends} 
          selectedRange={selectedRange} 
          onRangeChange={setSelectedRange} 
        />
      </div>
    </>
  );
};

const DashboardStyles = () => (
  <style>{`
    .custom-dashboard-bg {
      background: linear-gradient(135deg, #fffaf3 0%, #fff4e5 100%);
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 237, 213, 0.3);
    }
    .gradient-border {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      padding: 1px;
      border-radius: 12px;
    }
    .honey-gradient {
      background: linear-gradient(135deg, #fef3c7 0%, #fef7ed 100%);
    }
  `}</style>
);

export default AdminDash;