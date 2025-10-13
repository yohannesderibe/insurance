import React from "react";
import { TrendingUp } from "lucide-react";

interface UserStatsCardProps {
  period: string;
  value: number;
  borderColor: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

const UserStatsCard: React.FC<UserStatsCardProps> = ({
  period,
  value,
  borderColor,
  icon,
  bgColor,
  textColor
}) => {
  return (
    <div className={`glass-card rounded-2xl p-6 border-l-4 ${borderColor} hover:shadow-lg transition-all duration-300 honey-gradient`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 ${bgColor} rounded-lg`}>
          {icon}
        </div>
        <div className={`flex items-center ${textColor} text-sm font-medium`}>
          <TrendingUp className="w-4 h-4 mr-1" />
          {period === "This Week" ? "New" : period === "This Month" ? "Growth" : "Total"}
        </div>
      </div>
      <h4 className="text-2xl font-bold text-amber-900 mb-1">{value}</h4>
      <p className="text-amber-700 text-sm">{period}</p>
    </div>
  );
};

export default UserStatsCard; 