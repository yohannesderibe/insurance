// // import React from "react";

// // interface StatCardProps {
// //   title: string;
// //   value: number;
// //   color?: string;
// // }

// // const StatCard: React.FC<StatCardProps> = ({ title, value, color = "amber" }) => {
// //   return (
// //     <div
// //       className={`p-5 rounded-2xl shadow-md bg-gradient-to-br from-${color}-50 to-${color}-100 border border-${color}-300 flex flex-col justify-between`}
// //     >
// //       <h3 className="text-lg font-semibold text-amber-900">{title}</h3>
// //       <p className="text-3xl font-bold text-amber-800 mt-2">{value}</p>
// //     </div>
// //   );
// // };

// // export default StatCard;
// import React from "react";
// import { FiUsers } from "react-icons/fi";
// import { motion } from "framer-motion";

// interface StatCardProps {
//   title: string;
//   value: number;
//   icon?: React.ReactNode;
//   color?: string;
// }

// const StatCard: React.FC<StatCardProps> = ({
//   title,
//   value,
//   icon = <FiUsers />,
//   color = "from-amber-400 to-yellow-200",
// }) => {
//   return (
//     <motion.div
//       whileHover={{ scale: 1.05 }}
//       className={`bg-gradient-to-br ${color} p-5 rounded-2xl shadow-md border border-amber-100 flex items-center justify-between`}
//     >
//       <div>
//         <h3 className="text-sm font-medium text-amber-800">{title}</h3>
//         <p className="text-3xl font-bold text-amber-900">{value}</p>
//       </div>
//       <div className="text-4xl text-amber-900 opacity-80">{icon}</div>
//     </motion.div>
//   );
// };

// export default StatCard;
import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  isPositive: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, isPositive }) => {
  return (
    <div className="gradient-border">
      <div className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300 honey-gradient">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
            {icon}
          </div>
          <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600' : 'text-amber-600'}`}>
            {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
            Active
          </div>
        </div>
        <h3 className="text-3xl font-bold text-amber-900 mb-2">{value}</h3>
        <p className="text-amber-700 text-sm">{title}</p>
      </div>
    </div>
  );
};

export default StatCard;