import React from "react";
import { Users, UserCheck, UserCog, Briefcase, Building } from "lucide-react";
import StatCard from "../../reusable/UI/StatCard";

interface OverviewSectionProps {
  stats: any;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ stats }) => {
  const statIcons = {
    clients: <Users className="w-6 h-6" />,
    staff: <UserCheck className="w-6 h-6" />,
    operators: <UserCog className="w-6 h-6" />,
    finance: <Briefcase className="w-6 h-6" />,
    managers: <Building className="w-6 h-6" />
  };

  const statCards = [
    {
      key: "clients",
      title: "Total Clients",
      value: stats?.totalClients ?? 0,
      icon: statIcons.clients,
      isPositive: stats?.totalClients > 0
    },
    {
      key: "staff",
      title: "Total Staff",
      value: stats?.totalStaff ?? 0,
      icon: statIcons.staff,
      isPositive: stats?.totalStaff > 0
    },
    {
      key: "operators",
      title: "Operators",
      value: stats?.totalOperators ?? 0,
      icon: statIcons.operators,
      isPositive: stats?.totalOperators > 0
    },
    {
      key: "finance",
      title: "Finance Staff",
      value: stats?.totalFinanceStaff ?? 0,
      icon: statIcons.finance,
      isPositive: stats?.totalFinanceStaff > 0
    },
    {
      key: "managers",
      title: "Managers",
      value: stats?.totalManagers ?? 0,
      icon: statIcons.managers,
      isPositive: stats?.totalManagers > 0
    }
  ];

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold text-amber-900 mb-6 flex items-center">
        <Users className="w-6 h-6 mr-2" />
        Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((card) => (
          <StatCard
            key={card.key}
            title={card.title}
            value={card.value}
            icon={card.icon}
            isPositive={card.isPositive}
          />
        ))}
      </div>
    </section>
  );
};

export default OverviewSection;