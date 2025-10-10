import { Users } from "lucide-react";

interface UserManagementHeaderProps {
  usersCount: number;
}

export const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({ 
  usersCount 
}) => (
  <div className="mb-8">
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
          User Management
        </h1>
        <p className="text-amber-800 mt-2 text-lg">
          Manage all users, roles and permissions in one place
        </p>
      </div>
      <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-amber-200">
        <Users className="w-5 h-5 text-amber-600" />
        <span className="text-amber-700 font-medium">Active Users</span>
      </div>
    </div>
  </div>
);

export default UserManagementHeader;