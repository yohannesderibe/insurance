import { Users, Search } from "lucide-react";

interface StatsSummaryProps {
  selectedRole: string;
  totalUsers: number;
  filteredUsersCount: number;
  currentPage: number;
  totalPages: number;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({
  selectedRole,
  totalUsers,
  filteredUsersCount,
  currentPage,
  totalPages
}) => (
  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-amber-600 text-sm">Total {selectedRole}s</p>
          <p className="text-2xl font-bold text-amber-800">{totalUsers}</p>
        </div>
        <div className="p-2 bg-amber-100 rounded-lg">
          <Users className="w-5 h-5 text-amber-600" />
        </div>
      </div>
    </div>
    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-amber-600 text-sm">Filtered Results</p>
          <p className="text-2xl font-bold text-amber-800">{filteredUsersCount}</p>
        </div>
        <div className="p-2 bg-amber-100 rounded-lg">
          <Search className="w-5 h-5 text-amber-600" />
        </div>
      </div>
    </div>
    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-amber-600 text-sm">Current Page</p>
          <p className="text-2xl font-bold text-amber-800">{currentPage} / {totalPages}</p>
        </div>
        <div className="p-2 bg-amber-100 rounded-lg">
          <span className="text-amber-600 font-bold">📄</span>
        </div>
      </div>
    </div>
  </div>
);

export default StatsSummary;