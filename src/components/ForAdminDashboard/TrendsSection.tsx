import React from "react";
import { TrendingUp } from "lucide-react";
import TrendChart from "../../reusable/UI/TrendChart";

interface TrendsSectionProps {
  trends: any;
  selectedRange: string;
  onRangeChange: (range: string) => void;
}

const TrendsSection: React.FC<TrendsSectionProps> = ({
  trends,
  selectedRange,
  onRangeChange
}) => {
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
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-amber-900 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2" />
          User Trends
        </h2>
        <select
          value={selectedRange}
          onChange={(e) => onRangeChange(e.target.value)}
          className="glass-card border border-amber-200 rounded-xl px-4 py-2 text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent honey-gradient"
        >
          <option value="Monthly">Monthly View</option>
          <option value="Yearly">Yearly View</option>
        </select>
      </div>

      {/* Trend Chart */}
      <div className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300 honey-gradient">
        <TrendChart
          data={chartData}
          title={`User Growth (${selectedRange})`}
        />
      </div>
    </section>
  );
};

export default TrendsSection;