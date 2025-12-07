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


import {  createManager,
  createFinance,
  createOperator,
  createClient } from "../../../../api/Admin/CreateUser";
import UserTable from "../../../../components/Tables/UserTable";
import AddButton from "../../../../reusable/UI/AddButton";
import SearchBar from "../../../../reusable/UI/SearchBar";
import Pagination from "../../../../reusable/UI/Pagination";
import { Users, Search, Filter, AlertTriangle } from "lucide-react";
import DetailModal from "../../../../reusable/UI/DetailModal";
import EditUserModal from "../../../../reusable/UI/EditUserModal";
import { updateManager, updateOperator, updateFinance } from "../../../../api/Admin/userManagementTableApi";
import CreateManagerModal from "../../../../components/Modals/CreateManagerModal";
import CreateFinanceModal from "../../../../components/Modals/CreateFinanceModal";
import CreateOperatorModal from "../../../../components/Modals/CreateOperatorModal";
import CreateClientModal from "../../../../components/Modals/CreateClientModal";
import { Add } from "@mui/icons-material";

type RoleType = "Client" | "Manager" | "Finance Officer" | "Operation Officer";

interface User {
  id: string;
  fullName?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
  mobilePhone?: string;
  imageUrl?: string;
  gender?: string;
  region?: string;
  city?: string;
  subCity?: string;
  nationalIdOrPassport?: string;
  createdAt?: string;
}

// Delete Confirmation Modal Component
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  userEmail?: string;
  role: string;
  loading?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
  userEmail,
  role,
  loading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-red-200">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-lg font-semibold">Confirm Deletion</h2>
          <button 
            onClick={onClose} 
            className="text-white text-xl hover:text-red-200 transition-colors"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Are you sure you want to delete this {role.toLowerCase()}?
            </h3>
            <p className="text-gray-600 mb-2">
              This action cannot be undone.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-3">
              <p className="font-medium text-amber-800">{userName}</p>
              {userEmail && (
                <p className="text-amber-600 text-sm">{userEmail}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-5 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-medium hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserManagementPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<RoleType>("Client");
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Create modals state
  const [isCreateManagerOpen, setIsCreateManagerOpen] = useState(false);
  const [isCreateFinanceOpen, setIsCreateFinanceOpen] = useState(false);
  const [isCreateOperatorOpen, setIsCreateOperatorOpen] = useState(false);
  const [isCreateClientOpen, setIsCreateClientOpen] = useState(false);

  // Mock token - replace with actual auth token
  const token = "your-auth-token-here";

  // Helper function to get user display name
  const getUserDisplayName = (user: User): string => {
    if (!user) return "User";

    // Try different possible name properties in priority order
    if (user.fullName) return user.fullName;
    if (user.name) return user.name;
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    if (user.lastName) return user.lastName;
    if (user.userName && !user.userName.includes('@')) return user.userName;

    // Use email username part as fallback
    if (user.email) {
      const emailName = user.email.split('@')[0];
      return emailName;
    }

    // Use userName even if it's email, but extract the name part
    if (user.userName && user.userName.includes('@')) {
      const emailName = user.userName.split('@')[0];
      return emailName;
    }

    return "User";
  };

  // Helper function to get user email
  const getUserEmail = (user: User): string | undefined => {
    if (!user) return undefined;
    return user.email || user.userName; // Use userName as fallback for email
  };

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
      
      // Log the data structure to understand what properties are available
      console.log("Fetched data for", selectedRole, ":", data);
      
      if (Array.isArray(data) && data.length > 0) {
        // Log the first user to see the structure
        console.log("First user in data:", data[0]);
        console.log("All properties of first user:", Object.keys(data[0]));
      }
      
      // Map to table-friendly shape, especially for Clients
      if (Array.isArray(data)) {
        const mapped = data.map((u: any) => {
          if (selectedRole === "Client") {
            const fullName = [u.firstName, u.fatherName, u.grandFatherName]
              .filter(Boolean)
              .join(" ")
              .trim();
            return {
              id: u.id,
              fullName: fullName || u.firstName || "Client",
              email: u.email || "",
              mobilePhone: u.phoneNumber || "",
              imageUrl: u.passportOrNationalIdImageUrl ? `http://localhost:5150${u.passportOrNationalIdImageUrl}` : undefined,
              gender: u.gender,
              region: u.region,
              city: u.city,
              subCity: u.subCity,
              nationalIdOrPassport: u.nationalIdOrPassport,
              createdAt: u.createdAt,
              userName: u.email || undefined,
            } as User;
          }
          return u as User;
        });
        setUsers(mapped);
        setTotalPages(Math.ceil(mapped.length / 10));
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
    console.log("Editing user:", user);
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleSave = async (data: any) => {
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


  // Add these functions after your other handlers (like handleEdit, handleSave, etc.)

const handleCreateManager = async (formData: FormData) => {
  try {
    await createManager(token, formData);
    alert("Manager created successfully!");
    fetchData(); // Refresh the data
  } catch (error) {
    console.error("Error creating manager:", error);
    alert("Failed to create manager. Please try again.");
  }
};

const handleCreateFinance = async (formData: FormData) => {
  try {
    await createFinance(token, formData);
    alert("Finance officer created successfully!");
    fetchData(); // Refresh the data
  } catch (error) {
    console.error("Error creating finance officer:", error);
    alert("Failed to create finance officer. Please try again.");
  }
};

const handleCreateOperator = async (formData: FormData) => {
  try {
    await createOperator(token, formData);
    alert("Operation officer created successfully!");
    fetchData(); // Refresh the data
  } catch (error) {
    console.error("Error creating operation officer:", error);
    alert("Failed to create operation officer. Please try again.");
  }
};

const handleCreateClient = async (formData: FormData) => {
  try {
    await createClient(token, formData);
    alert("Client created successfully!");
    fetchData(); // Refresh the data
  } catch (error) {
    console.error("Error creating client:", error);
    alert("Failed to create client. Please try again.");
  }
};

  const filteredUsers = users.filter(user => {
    const userName = getUserDisplayName(user).toLowerCase();
    const userEmail = getUserEmail(user)?.toLowerCase() || "";
    const searchLower = searchTerm.toLowerCase();
    
    return userName.includes(searchLower) || userEmail.includes(searchLower);
  });

  // New delete handler with confirmation modal
  const handleDeleteClick = (user: User) => {
    console.log("User to delete:", user);
    console.log("User display name:", getUserDisplayName(user));
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setDeleteLoading(true);
    try {
      switch (selectedRole) {
        case "Client":
          await deleteClient(token, userToDelete.id);
          break;
        case "Manager":
          await deleteManager(token, userToDelete.id);
          break;
        case "Finance Officer":
          await deleteFinance(token, userToDelete.id);
          break;
        case "Operation Officer":
          await deleteOperator(token, userToDelete.id);
          break;
      }

      setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id));
      
      // Close modal and reset state
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      
      // Show success message
      alert(`${selectedRole} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
    setDeleteLoading(false);
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

  const handleAddUser = () => {
    switch(selectedRole){
      case "Manager":
        setIsCreateManagerOpen(true);
        break;
      case "Finance Officer":
        setIsCreateFinanceOpen(true);
        break;
      case "Operation Officer":
        setIsCreateOperatorOpen(true);
        break;  
      case "Client":
        setIsCreateClientOpen(true);
        break;
    }
  }

  return (
    <div>
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
        </div>
        <div className="mb-6">
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
              onDelete={handleDeleteClick} // Updated to use the new handler
              onView={handleView}
            />
            
            {/* Modals */}
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

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
              isOpen={isDeleteModalOpen}
              onClose={handleDeleteCancel}
              onConfirm={handleDeleteConfirm}
              userName={userToDelete ? getUserDisplayName(userToDelete) : "User"}
              userEmail={userToDelete ? getUserEmail(userToDelete) : undefined}
              role={selectedRole}
              loading={deleteLoading}
            />

            {/* Create Modals */}
          {/* Create Modals */}
            <CreateManagerModal
              isOpen={isCreateManagerOpen}
              onClose={() => setIsCreateManagerOpen(false)}
              onSubmit={handleCreateManager}
            />
            <CreateFinanceModal
              isOpen={isCreateFinanceOpen}
              onClose={() => setIsCreateFinanceOpen(false)}
              onSubmit={handleCreateFinance}
            />
            <CreateOperatorModal
              isOpen={isCreateOperatorOpen}
              onClose={() => setIsCreateOperatorOpen(false)}
              onSubmit={handleCreateOperator}
            />
            <CreateClientModal
              isOpen={isCreateClientOpen}
              onClose={() => setIsCreateClientOpen(false)}
              onSubmit={handleCreateClient}
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
  );
};

export default UserManagementPage;
