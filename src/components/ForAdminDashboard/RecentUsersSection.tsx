import React from "react";
import { UserPlus, Users, UserCheck, TrendingUp } from "lucide-react";
import UserStatsCard from "../../reusable/UI/StatCard";

interface RecentUsersSectionProps {
  trends: any;
}

const RecentUsersSection: React.FC<RecentUsersSectionProps> = ({ trends }) => {
  const clientStats = [
    {
      period: "This Week",
      value: trends?.clients?.addedThisWeek ?? 0,
      borderColor: "border-green-400",
      icon: <Users className="w-5 h-5 text-green-600" />,
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      period: "This Month",
      value: trends?.clients?.addedThisMonth ?? 0,
      borderColor: "border-green-500",
      icon: <Users className="w-5 h-5 text-green-600" />,
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      period: "This Year",
      value: trends?.clients?.addedThisYear ?? 0,
      borderColor: "border-green-600",
      icon: <Users className="w-5 h-5 text-green-600" />,
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    }
  ];

  const staffStats = [
    {
      period: "This Week",
      value: trends?.staff?.addedThisWeek ?? 0,
      borderColor: "border-blue-400",
      icon: <UserCheck className="w-5 h-5 text-blue-600" />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      period: "This Month",
      value: trends?.staff?.addedThisMonth ?? 0,
      borderColor: "border-blue-500",
      icon: <UserCheck className="w-5 h-5 text-blue-600" />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      period: "This Year",
      value: trends?.staff?.addedThisYear ?? 0,
      borderColor: "border-blue-600",
      icon: <UserCheck className="w-5 h-5 text-blue-600" />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    }
  ];

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold text-amber-900 mb-6 flex items-center">
        <UserPlus className="w-6 h-6 mr-2" />
        Recently Added Users
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Clients Section */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-green-600" />
            Clients
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {clientStats.map((stat, index) => (
              <UserStatsCard
                key={index}
                period={stat.period}
                value={stat.value}
                borderColor={stat.borderColor}
                icon={stat.icon}
                bgColor={stat.bgColor}
                textColor={stat.textColor}
              />
            ))}
          </div>
        </div>

        {/* Staff Section */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-6">
          <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center">
            <UserCheck className="w-5 h-5 mr-2 text-blue-600" />
            Staff Members
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {staffStats.map((stat, index) => (
              <UserStatsCard
                key={index}
                period={stat.period}
                value={stat.value}
                borderColor={stat.borderColor}
                icon={stat.icon}
                bgColor={stat.bgColor}
                textColor={stat.textColor}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentUsersSection;