import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import type { FC } from "react";
// import  customerMenu  from "../Bars/SideBars/Customer";
import MenuIcon from "@mui/icons-material/Menu";


interface TopBarprops {
    onMenuClick: () => void;
    style?: React.CSSProperties;
}

const TopBar: FC<TopBarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
//   const location = useLocation();

const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    navigate("/signin");
  };

//   const currentLabel =
//     customerMenu.find((item) => item.to === location.pathname)?.label ?? "Dashboard";

return(
    <header
      className={`h-17 bg-white px-4 md:pr-16 flex items-center justify-between shadow-sm z-20 
        mt-2 mx-4 rounded-[15px]`}
    >
      <div className="flex items-center gap-4">
         
          <>
            <button 
            aria-label="click"
            onClick={onMenuClick} className="md:hidden">
              <MenuIcon fontSize="medium" className="text-gray-600" />
            </button>
            <h1 className="text-lg md:text-xl font-semibold text-green-600 sm:block">
              {/* {currentLabel} */}
            </h1>
          </>
        
      </div>

      <div className="flex items-center gap-3 relative" ref={dropdownRef}>
        <img
          src="https://i.pravatar.cc/40"
          className="w-9 h-9 rounded-full object-cover"
          alt="User Avatar"
        />

        <span className="text-gray-800 text-sm font-medium hidden sm:inline">
          {user?.name ?? "User unknown"}
        </span>

        <button
          aria-label="click"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30 border border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
);
};

export default TopBar;
