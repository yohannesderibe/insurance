import React, { useEffect, useState } from "react";
import QuickActionCard from "../../../components/Customer/Dashboard/QuickActionCard";
import { getCustomerDashboard } from "../../../api/Coustomer/CoustomerDash";

type DashboardData = {
  stats: {
    activePolicies: number;
    pendingClaims: number;
    upcomingRenewals: number;
    totalCoverage: string;
  };
  quickActions: {
    title: string;
    description: string;
    icon: string;
    color: string;
  }[];
};

const CustomerDash: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [user, setUser] = useState<{ fullName?: string; name?: string; role?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    getCustomerDashboard().then(setData);
  }, []);

  if (!data)
    return (
      <div className="flex justify-center items-center min-h-screen text-amber-600">
        <div className="text-center">
          <div className="animate-bounce mb-4">🐝</div>
          <p className="text-lg font-medium">Loading your hive...</p>
        </div>
      </div>
    );

  const displayName = user?.fullName || user?.name || "Beekeeper";

  return (
    <div className="min-h-screen bg-white p-8">
      {/* ================== WELCOME SECTION ================== */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-14">
        {/* Left Text */}
        <div className="flex-1 pr-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Welcome back,{" "}
            <span className="text-amber-600">{displayName}</span>
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
            Your insurance hub. Manage policies, file claims, and find the
            perfect coverage—all in one place.
          </p>
        </div>

        {/* Right Image */}
        <div className="flex-shrink-0 mt-6 md:mt-0 md:ml-10">
          <img
            src="/src/assets/LogoWithName1.png"
            alt="Insurance Family"
            className="rounded-2xl w-[420px] h-[260px] object-cover"
          />
        </div>
      </div>

      {/* ================== QUICK ACTIONS HEADER ================== */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Quick Actions
        </h2>
      </div>

      {/* ================== STATS SECTION ================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Active Policies */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600 font-medium">Active Policies</p>
              <h3 className="text-4xl font-bold text-gray-900 mt-2">
                {data.stats.activePolicies}
              </h3>
              <p className="text-gray-500 text-sm mt-2">
                🍯 Total coverage: {data.stats.totalCoverage}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <span className="text-amber-600 text-xl">📄</span>
            </div>
          </div>
        </div>

        {/* Pending Claims */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Pending Claims</p>
              <h3 className="text-4xl font-bold text-gray-900 mt-2">
                {data.stats.pendingClaims}
              </h3>
              <p className="text-gray-500 text-sm mt-2">🐝 Under review</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 text-xl">⏳</span>
            </div>
          </div>
        </div>

        {/* Upcoming Renewals */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Upcoming Renewals</p>
              <h3 className="text-4xl font-bold text-gray-900 mt-2">
                {data.stats.upcomingRenewals}
              </h3>
              <p className="text-gray-500 text-sm mt-2">📅 Within 30 days</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-xl">🔄</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================== QUICK ACTIONS GRID ================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {data.quickActions.map((action, index) => (
          <QuickActionCard key={index} {...action} />
        ))}
      </div>
    </div>
  );
};

export default CustomerDash;
