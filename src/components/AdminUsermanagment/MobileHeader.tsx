interface MobileHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  setSidebarOpen
}) => (
  <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-20 p-4 border-b border-amber-200">
    <div className="flex items-center justify-between">
      <button 
        onClick={() => setSidebarOpen(true)}
        className="p-2 rounded-lg bg-amber-100 text-amber-700"
      >
        ☰
      </button>
      <h1 className="text-lg font-bold text-amber-900">User Management</h1>
      <div className="w-8"></div>
    </div>
  </div>
);

export default MobileHeader;