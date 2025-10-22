import React from "react";
import { ShieldPlus, FileText, FileWarning, Bell } from "lucide-react";

type QuickActionProps = {
  title: string;
  description: string;
  color: string;
  icon: string;
};

const iconMap: Record<string, JSX.Element> = {
  ShieldPlus: <ShieldPlus className="w-6 h-6 text-amber-700" />,
  FileText: <FileText className="w-6 h-6 text-amber-700" />,
  FileWarning: <FileWarning className="w-6 h-6 text-amber-700" />,
  Bell: <Bell className="w-6 h-6 text-amber-700" />
};

const colorMap: Record<string, string> = {
  "bg-yellow-100": "bg-amber-100 border-amber-300",
  "bg-blue-100": "bg-amber-50 border-amber-200",
  "bg-orange-100": "bg-orange-50 border-orange-200",
  "bg-purple-100": "bg-yellow-50 border-yellow-200"
};

const QuickActionCard: React.FC<QuickActionProps> = ({
  title,
  description,
  color,
  icon
}) => (
  <div
    className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white border-t-4 ${colorMap[color] || color} hover:translate-y-[-4px] group cursor-pointer`}
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 group-hover:from-amber-200 group-hover:to-amber-100 transition-all duration-300 shadow-sm">
        {iconMap[icon]}
      </div>
      <h3 className="font-bold text-lg text-amber-900 group-hover:text-amber-800 transition-colors">
        {title}
      </h3>
    </div>
    <p className="text-amber-700 text-sm leading-relaxed">{description}</p>
    
    {/* Honeycomb decoration */}
    <div className="flex justify-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="w-6 h-6 bg-amber-200 rounded transform rotate-45"></div>
    </div>
  </div>
);

export default QuickActionCard;