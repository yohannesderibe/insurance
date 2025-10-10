import AddButton from "../../reusable/UI/AddButton";

type RoleType = "Client" | "Manager" | "Finance Officer" | "Operation Officer";

interface RoleTabsSectionProps {
  selectedRole: RoleType;
  setSelectedRole: (role: RoleType) => void;
  setCurrentPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
  handleAddUser: () => void;
}

export const RoleTabsSection: React.FC<RoleTabsSectionProps> = ({
  selectedRole,
  setSelectedRole,
  setCurrentPage,
  setSearchTerm,
  handleAddUser
}) => {
  const roleTabs: RoleType[] = ["Client", "Finance Officer", "Manager", "Operation Officer"];

  const handleRoleChange = (role: RoleType) => {
    setSelectedRole(role);
    setCurrentPage(1);
    setSearchTerm("");
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {roleTabs.map((role) => (
          <button
            key={role}
            onClick={() => handleRoleChange(role)}
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
  );
};

export default RoleTabsSection;