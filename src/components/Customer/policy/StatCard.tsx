// // src/components/PaidApplications/StatCard.tsx
// import React from "react";
// import { type LucideIcon } from "lucide-react";

// interface StatCardProps {
//   title: string;
//   value: string | number;
//   icon: LucideIcon;
//   color: 'emerald' | 'amber' | 'blue' | 'purple';
// }

// const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => {
//   const colorClasses = {
//     emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-100' },
//     amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-100' },
//     blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-100' },
//     purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-100' }
//   };

//   return (
//     <div className={`bg-white border ${colorClasses[color].border} rounded-2xl p-5 shadow-sm`}>
//       <div className="flex items-center gap-4">
//         <div className={`${colorClasses[color].bg} ${colorClasses[color].text} p-3 rounded-2xl`}>
//           <Icon className="w-6 h-6" />
//         </div>
//         <div>
//           <p className="text-sm font-medium">{title}</p>
//           <p className="text-2xl font-bold">{value}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StatCard; 
import React from "react";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'emerald' | 'amber' | 'blue' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-100' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-100' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-100' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-100' }
  };

  return (
    <div className={`bg-white border ${colorClasses[color].border} rounded-2xl p-5 shadow-sm`}>
      <div className="flex items-center gap-4">
        <div className={`${colorClasses[color].bg} ${colorClasses[color].text} p-3 rounded-2xl`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;