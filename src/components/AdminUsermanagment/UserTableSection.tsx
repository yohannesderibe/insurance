import UserTable from "../../components/Tables/UserTable";
import Pagination from "../../reusable/UI/Pagination";
import DetailModal from "../../reusable/UI/DetailModal";
import EditUserModal from "../../reusable/UI/EditUserModal";

type RoleType = "Client" | "Manager" | "Finance Officer" | "Operation Officer";

interface User {
  id: string;
  fullName?: string;
  email?: string;
}

interface UserTableSectionProps {
  loading: boolean;
  paginatedUsers: User[];
  selectedRole: RoleType;
  filteredUsers: User[];
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  selectedUser: User | null;
  isDetailOpen: boolean;
  isEditOpen: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onView: (user: User) => void;
  onSave: (data: any) => void;
  onPageChange: (page: number) => void;
  onCloseDetail: () => void;
  onCloseEdit: () => void;
}

export const UserTableSection: React.FC<UserTableSectionProps> = ({
  loading,
  paginatedUsers,
  selectedRole,
  filteredUsers,
  searchTerm,
  currentPage,
  totalPages,
  selectedUser,
  isDetailOpen,
  isEditOpen,
  onEdit,
  onDelete,
  onView,
  onSave,
  onPageChange,
  onCloseDetail,
  onCloseEdit
}) => {
  const getEditModalRole = (): "manager" | "operator" | "finance" => {
    switch (selectedRole) {
      case "Manager": return "manager";
      case "Operation Officer": return "operator";
      case "Finance Officer": return "finance";
      default: return "manager";
    }
  };

  return (
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
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
          <DetailModal
            isOpen={isDetailOpen}
            onClose={onCloseDetail}
            title={`${selectedRole} Details`}
            data={selectedUser}
          />
          <EditUserModal
            isOpen={isEditOpen}
            onClose={onCloseEdit}
            role={getEditModalRole()}
            user={selectedUser}
            onSave={onSave}
          />
          
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-amber-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </>
      )}

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
  );
};

export default UserTableSection;