// src/pages/Admin/UserManagementPage.tsx
import React, { useEffect, useState } from "react";
import {
  getClients,
  getManagers,
  getOperators,
  getFinances,
  deleteClient,
  deleteManager,
  deleteOperator,
  deleteFinance
} from "../../../../api/Admin/userManagementTableApi";
import UserTable from "../../../../components/Tables/UserTable";
import AddButton from "../../../../reusable/UI/AddButton";
import SearchBar from "../../../../reusable/UI/SearchBar";
import Pagination from "../../../../reusable/UI/Pagination";
import Sidebar from "../../../../components/Bars/SideBars/Admin";
import { Users, Search, Filter } from "lucide-react";
import DetailModal from "../../../../reusable/UI/DetailModal";
import EditUserModal from "../../../../reusable/UI/EditUserModal";
import { updateManager, updateOperator, updateFinance } from "../../../../api/Admin/userManagementTableApi";

type RoleType = "Client" | "Manager" | "Finance Officer" | "Operation Officer";

interface User {
  id: string;
  fullName?: string;
  email?: string;
  // Add other user properties as needed
}

const UserManagementPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<RoleType>("Client");
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Mock token - replace with actual auth token
  const token = "your-auth-token-here";

  // Move fetchData outside useEffect so it can be reused
  const fetchData = async () => {
    setLoading(true);
    try {
      let data;
      switch (selectedRole) {
        case "Client":
          data = await getClients(token);
          break;
        case "Manager":
          data = await getManagers(token);
          break;
        case "Finance Officer":
          data = await getFinances(token);
          break;
        case "Operation Officer":
          data = await getOperators(token);
          break;
        default:
          data = await getClients(token);
      }
      
      // data is already the array, no need for data.data
      if (Array.isArray(data)) {
        setUsers(data);
        setTotalPages(Math.ceil(data.length / 10));
      } else {
        console.error("Expected array but got:", data);
        setUsers([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedRole, currentPage]);

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleSave = async (data: any) => { // Changed from FormData to any
    if (!selectedUser) return;

    try {
      // Debug: Log what's in the data (now JSON object)
      console.log("Data contents:", data);
      
      if (selectedRole === "Manager") {
        await updateManager(token, selectedUser.id, data);
      } else if (selectedRole === "Operation Officer") {
        await updateOperator(token, selectedUser.id, data);
      } else if (selectedRole === "Finance Officer") {
        await updateFinance(token, selectedUser.id, data);
      }

      setIsEditOpen(false);
      await fetchData(); // Now this will work - refresh the table after update
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  const filteredUsers = users.filter(user =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${selectedRole.toLowerCase()}?`)) return;

    try {
      switch (selectedRole) {
        case "Client":
          await deleteClient(token, id);
          break;
        case "Manager":
          await deleteManager(token, id);
          break;
        case "Finance Officer":
          await deleteFinance(token, id);
          break;
        case "Operation Officer":
          await deleteOperator(token, id);
          break;
      }

      setUsers((prev) => prev.filter((user) => user.id !== id));
      alert(`${selectedRole} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  const handleAddUser = () => {
    console.log(`Add ${selectedRole}`);
    // Implement add functionality
  };

  const roleTabs: RoleType[] = ["Client", "Finance Officer", "Manager", "Operation Officer"];

  // Calculate paginated users
  const usersPerPage = 10;
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  // Fix role mapping for EditUserModal
  const getEditModalRole = (): "manager" | "operator" | "finance" => {
    switch (selectedRole) {
      case "Manager": return "manager";
      case "Operation Officer": return "operator";
      case "Finance Officer": return "finance";
      default: return "manager"; // fallback
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-amber-50/50 to-yellow-50/50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-20 p-4 border-b border-amber-200">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-amber-100 text-amber-700"
          >
            ☰
          </button>
          <h1 className="text-lg font-bold text-amber-900">User Management</h1>
          <div className="w-8"></div> {/* Spacer for balance */}
        </div>
      </div>

      <main className="flex-1 md:ml-64 pt-16 md:pt-0">
        <div className="p-6">
          {/* Header Section */}
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

            {/* Role Tabs and Add Button */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
              <div className="flex flex-wrap gap-2">
                {roleTabs.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setSelectedRole(role);
                      setCurrentPage(1);
                      setSearchTerm("");
                    }}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      selectedRole === role
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg"
                        : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                    }`}
                  >
                    {role}s
                  </button>
                ))}
              </div>

              <AddButton 
                label={`Add ${selectedRole}`} 
                onClick={handleAddUser} 
              />
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              <div className="flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
                  <SearchBar
                    placeholder={`Search ${selectedRole.toLowerCase()} by name or email...`}
                    value={searchTerm}
                    onChange={setSearchTerm}
                  />
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          {/* User Table Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-amber-200 overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
              </div>
            ) : (
              <>
                <UserTable 
                  data={paginatedUsers} 
                  role={selectedRole} 
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                />
                <DetailModal
                  isOpen={isDetailOpen}
                  onClose={() => setIsDetailOpen(false)}
                  title={`${selectedRole} Details`}
                  data={selectedUser}
                />
                <EditUserModal
                  isOpen={isEditOpen}
                  onClose={() => setIsEditOpen(false)}
                  role={getEditModalRole()}
                  user={selectedUser}
                  onSave={handleSave}
                />
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-amber-200">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}

            {/* Empty State */}
            {!loading && filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-amber-400 text-6xl mb-4">👥</div>
                <h3 className="text-lg font-semibold text-amber-800 mb-2">
                  No {selectedRole.toLowerCase()}s found
                </h3>
                <p className="text-amber-600">
                  {searchTerm ? "Try adjusting your search terms" : `No ${selectedRole.toLowerCase()}s have been added yet`}
                </p>
              </div>
            )}
          </div>

          {/* Stats Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 text-sm">Total {selectedRole}s</p>
                  <p className="text-2xl font-bold text-amber-800">{users.length}</p>
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
                  <p className="text-2xl font-bold text-amber-800">{filteredUsers.length}</p>
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
        </div>
      </main>
    </div>
  );
};

export default UserManagementPage;