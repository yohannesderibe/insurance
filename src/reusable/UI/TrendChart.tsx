// import React from "react";
// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// interface TrendChartProps {
//   data: { name: string; clients: number; staff: number }[];
//   title: string;
// }

// const TrendChart: React.FC<TrendChartProps> = ({ data, title }) => {
//   return (
//     <div className="bg-white rounded-2xl shadow-md p-6 border border-amber-200">
//       <h2 className="text-xl font-semibold text-amber-900 mb-4">{title}</h2>
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" stroke="#f3d9a4" />
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Line type="monotone" dataKey="clients" stroke="#f59e0b" strokeWidth={2} name="Clients" />
//           <Line type="monotone" dataKey="staff" stroke="#92400e" strokeWidth={2} name="Staff" />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default TrendChart;
import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface TrendChartProps {
  data: any[];
  title: string;
  type?: "Weekly" | "Monthly" | "Yearly";
}

const TrendChart: React.FC<TrendChartProps> = ({ data, title, type }) => {
  // 💛 Choose chart type dynamically
  const renderChart = () => {
    switch (type) {
      case "Weekly":
        return (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="clients"
              stroke="#fbbf24"
              fillOpacity={1}
              fill="url(#colorClients)"
            />
            <Area
              type="monotone"
              dataKey="staff"
              stroke="#f59e0b"
              fillOpacity={0.6}
              fill="url(#colorClients)"
            />
          </AreaChart>
        );

      case "Yearly":
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="clients" stroke="#fbbf24" strokeWidth={2} />
            <Line type="monotone" dataKey="staff" stroke="#f59e0b" strokeWidth={2} />
          </LineChart>
        );

      default:
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="clients" fill="#fbbf24" radius={[6, 6, 0, 0]} />
            <Bar dataKey="staff" fill="#f59e0b" radius={[6, 6, 0, 0]} />
          </BarChart>
        );
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-amber-100">
      <h3 className="text-xl font-semibold text-amber-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
