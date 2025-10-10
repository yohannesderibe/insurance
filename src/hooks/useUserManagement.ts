// src/pages/Admin/hooks/useUserManagement.ts
import { useState, useEffect, useCallback } from "react";
import {
  getClients,
  getManagers,
  getOperators,
  getFinances,
  deleteClient,
  deleteManager,
  deleteOperator,
  deleteFinance,
  updateManager,
  updateOperator,
  updateFinance
} from "../api/Admin/userManagementTableApi";

type RoleType = "Client" | "Manager" | "Finance Officer" | "Operation Officer";

interface User {
  id: string;
  fullName?: string;
  email?: string;
}

export const useUserManagement = () => {
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

  const token = "mock-token"; // Replace with actual auth token

  const fetchData = useCallback(async () => {
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
  }, [selectedRole]);

  useEffect(() => {
    fetchData();
  }, [selectedRole, currentPage, fetchData]);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleSave = async (data: any) => {
    if (!selectedUser) return;

    try {
      if (selectedRole === "Manager") {
        await updateManager(token, selectedUser.id, data);
      } else if (selectedRole === "Operation Officer") {
        await updateOperator(token, selectedUser.id, data);
      } else if (selectedRole === "Finance Officer") {
        await updateFinance(token, selectedUser.id, data);
      }

      setIsEditOpen(false);
      await fetchData();
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

  const usersPerPage = 10;
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  return {
    selectedRole,
    setSelectedRole,
    users,
    filteredUsers,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    loading,
    sidebarOpen,
    setSidebarOpen,
    selectedUser,
    setSelectedUser,
    isDetailOpen,
    setIsDetailOpen,
    isEditOpen,
    setIsEditOpen,
    fetchData,
    handleEdit,
    handleSave,
    handleView,
    handleDelete,
    handleAddUser,
    paginatedUsers
  };
};