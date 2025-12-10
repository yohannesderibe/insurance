import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  AlertCircle,
  User,
  Menu,
  X,
  LogOut,
  ChevronDown,
  ClipboardCheck
} from "lucide-react";

const CustomerTopNav: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", to: "/customerdash", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Categories", to: "/categories", icon: <FolderKanban className="w-5 h-5" /> },
    { label: "Policies", to: "/policy", icon: <FileText className="w-5 h-5" /> },
    { label: "Claims", to: "/claims", icon: <AlertCircle className="w-5 h-5" /> },
    {
      label: "Apply For Insurance",
      to: "/apply/personal-info",
      icon: <ClipboardCheck className="w-5 h-5" />
    },
    {
      label: "Finance Review & Payment",
      to: "/insurance/apply/payment",
      icon: <ClipboardCheck className="w-5 h-5" />
    }
  ];

  return (
    <>
      {/* Desktop Top Navigation */}
      <nav className="hidden lg:flex fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto w-full px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-sm">
                <img src="/src/assets/bee-logo.png" alt="Logo" className="w-6 h-6 object-contain" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-neutral-800">NIB Insurance</h1>
                {/* <p className="text-xs text-neutral-500">Customer Portal</p> */}

              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                      ? "bg-amber-50 text-amber-700 shadow-sm"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3 relative" ref={dropdownRef}>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="hidden xl:block text-left">
                  <p className="text-sm font-medium text-neutral-800">{user?.name || "User"}</p>
                  <p className="text-xs text-neutral-500">Customer</p>
                </div>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <ChevronDown className={`w - 4 h - 4 transition - transform duration - 200 ${isDropdownOpen ? 'rotate-180' : ''} `} />
                </button>
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-200/50 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-neutral-100">
                    <p className="text-sm font-semibold text-neutral-800">{user?.name || "User"}</p>
                    <p className="text-xs text-neutral-500">{user?.email || "user@example.com"}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/customer/profile');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200/50 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <div className="w-14 h-14 rounded-lg flex items-center justify-center">
              <img src="/src/assets/bee-logo.png" alt="Logo" className="w-14 h-14 object-contain" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-neutral-800">Insurance</h1>
              <p className="text-xs text-neutral-500">Customer</p>
            </div>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-50 animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <aside className="lg:hidden fixed top-16 left-0 bottom-0 w-72 bg-white border-r border-neutral-200/50 shadow-xl z-50 overflow-y-auto animate-in slide-in-from-left duration-300">
            <div className="p-6">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-semibold shadow-sm">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-neutral-800">{user?.name || "User"}</p>
                  <p className="text-xs text-neutral-500">Customer</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                        ? "bg-amber-50 text-amber-700 shadow-sm"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              {/* Profile & Logout */}
              <div className="mt-6 pt-6 border-t border-neutral-100 space-y-1">
                <button
                  onClick={() => {
                    navigate('/customer/profile');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
                >
                  <User className="w-5 h-5" />
                  My Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default CustomerTopNav;

