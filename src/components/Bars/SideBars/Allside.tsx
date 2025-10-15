// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import CloseIcon from "@mui/icons-material/Close";
// import MenuIcon from "@mui/icons-material/Menu";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import { MENU_CONFIG, STYLE_CONFIG } from "./sidebarConfig";
// import type { MenuItem }  from "./sidebarConfig";
// interface SidebarProps {
//   open: boolean;
//   onClose: () => void;
//   onCollapse?: (collapsed: boolean) => void;
//   role: string; // This is the key difference - we pass the role as prop
// }

// const Sidebar: React.FC<SidebarProps> = ({ open, onClose, onCollapse, role }) => {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   // Get menu items and styles for the specific role
//   const menuItems: MenuItem[] = MENU_CONFIG[role] || MENU_CONFIG.customer;
//   const styles = STYLE_CONFIG[role] || STYLE_CONFIG.customer;

//   const toggleSidebar = () => {
//     const newCollapsedState = !isCollapsed;
//     setIsCollapsed(newCollapsedState);
//     onCollapse?.(newCollapsedState);
//   };

//   const isLightTheme = role === "operator";
//   const textColor = isLightTheme ? "text-black" : "text-white";
//   const borderColor = isLightTheme ? "border-gray-300" : "border-yellow-700";
//   const hoverButton = isLightTheme ? "hover:bg-gray-100" : "hover:bg-yellow-600/30";
//   const bgButton = isLightTheme ? "bg-gray-100 hover:bg-gray-200" : "bg-yellow-600/30 hover:bg-yellow-600/50";

//   return (
//     <>
//       {/* Desktop Sidebar */}
//       <aside 
//         className={`hidden md:block fixed h-full top-0 left-0 z-30 transition-all duration-300 ${
//           isCollapsed ? "w-16" : "w-64"
//         } ${styles.desktop}`}
//       >
//         {/* Logo and Toggle */}
//         <div className={`h-20 px-4 flex items-center border-b ${borderColor} ${
//           isCollapsed ? "justify-center" : "justify-between"
//         }`}>
          
//           {!isCollapsed && (
//             <img 
//               src="/src/assets/LogoWithName1.png" 
//               alt="Logo" 
//               className="h-8" 
//             />
//           )}
          
//           <button
//             onClick={toggleSidebar}
//             className={`p-1 rounded-lg transition-colors ${hoverButton} ${textColor}`}
//             aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
//           >
//             {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex flex-col gap-2 px-4 mt-6">
//           {menuItems.map((item) => (
//             <NavLink
//               key={`${item.label}-${item.to}`}
//               to={item.to}
//               className={({ isActive }) =>
//                 `capitalize px-3 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
//                   isActive ? styles.active : `${textColor} ${styles.hover}`
//                 } ${isCollapsed ? "justify-center" : ""}`
//               }
//               title={isCollapsed ? item.label : ""}
//             >
//               <span className="flex-shrink-0">{item.icon}</span>
//               {!isCollapsed && <span>{item.label}</span>}
//             </NavLink>
//           ))}
//         </nav>

//         {/* Collapse Button (Bottom) */}
//         <div className={`absolute bottom-4 left-0 right-0 px-4 ${
//           isCollapsed ? "flex justify-center" : ""
//         }`}>
//           <button
//             onClick={toggleSidebar}
//             className={`p-2 rounded-lg transition-colors ${bgButton} ${textColor} ${
//               isCollapsed ? "" : "w-full flex items-center gap-3 px-3"
//             }`}
//             aria-label="Toggle sidebar"
//           >
//             <MenuIcon />
//             {!isCollapsed && <span>Collapse Menu</span>}
//           </button>
//         </div>
//       </aside>

//       {/* Mobile Sidebar */}
//       {open && (
//         <div className="fixed inset-0 z-40 md:hidden">
//           <div className="fixed inset-0 bg-black/40" onClick={onClose}></div>

//           <aside className={`absolute left-0 top-0 h-full z-50 transition-transform ${
//             isCollapsed ? "w-16" : "w-64"
//           } ${styles.mobile}`}>
            
//             {/* Logo + Close + Toggle */}
//             <div className={`h-20 px-4 flex items-center border-b ${borderColor} relative ${
//               isCollapsed ? "justify-center" : "justify-between"
//             }`}>
              
//               {!isCollapsed && (
//                 <img src="/src/assets/niblogo.svg" alt="Logo" className="h-10" />
//               )}
              
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={toggleSidebar}
//                   className={`p-1 rounded-lg transition-colors ${hoverButton} ${textColor}`}
//                   aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
//                 >
//                   {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
//                 </button>
                
//                 {!isCollapsed && (
//                   <button
//                     className={`p-1 rounded-lg transition-colors ${hoverButton} ${textColor}`}
//                     onClick={onClose}
//                     aria-label="close"
//                   >
//                     <CloseIcon />
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Navigation */}
//             <nav className="flex flex-col gap-2 px-4 mt-6">
//               {menuItems.map((item) => (
//                 <NavLink
//                   key={`${item.label}-${item.to}`}
//                   to={item.to}
//                   onClick={onClose}
//                   className={({ isActive }) =>
//                     `capitalize px-3 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
//                       isActive ? styles.active : `${textColor} ${styles.hover}`
//                     } ${isCollapsed ? "justify-center" : ""}`
//                   }
//                   title={isCollapsed ? item.label : ""}
//                 >
//                   <span className="flex-shrink-0">{item.icon}</span>
//                   {!isCollapsed && <span>{item.label}</span>}
//                 </NavLink>
//               ))}
//             </nav>

//             {/* Collapse Button (Bottom - Mobile) */}
//             <div className={`absolute bottom-4 left-0 right-0 px-4 ${
//               isCollapsed ? "flex justify-center" : ""
//             }`}>
//               <button
//                 onClick={toggleSidebar}
//                 className={`p-2 rounded-lg transition-colors ${bgButton} ${textColor} ${
//                   isCollapsed ? "" : "w-full flex items-center gap-3 px-3"
//                 }`}
//                 aria-label="Toggle sidebar"
//               >
//                 <MenuIcon />
//                 {!isCollapsed && <span>Collapse Menu</span>}
//               </button>
//             </div>
//           </aside>
//         </div>
//       )}
//     </>
//   );
// };

// export default Sidebar;
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
// import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LogoutIcon from "@mui/icons-material/Logout";
import { MENU_CONFIG, STYLE_CONFIG } from "./sidebarConfig";
import type { MenuItem } from "./sidebarConfig";

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  onCollapse?: (collapsed: boolean) => void;
  role: string;
  user?: {
    fullName?: string;
    name?: string;
    role?: string;
  };
}


const Sidebar: React.FC<SidebarProps> = ({onCollapse, role, user }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ fullName: string; role: string } | null>(user || null);
  const navigate = useNavigate();

  const menuItems: MenuItem[] = MENU_CONFIG[role] || MENU_CONFIG.customer;
  const styles = STYLE_CONFIG[role] || STYLE_CONFIG.customer;

  useEffect(() => {
    // If user prop not provided, try localStorage
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } else {
      setCurrentUser(user);
    }
  }, [user]);

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapse?.(newCollapsedState);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isLightTheme = role === "operator";
  const textColor = isLightTheme ? "text-black" : "text-white";
  const borderColor = isLightTheme ? "border-gray-300" : "border-yellow-700";
  const hoverButton = isLightTheme ? "hover:bg-gray-100" : "hover:bg-yellow-600/30";
  const bgButton = isLightTheme ? "bg-gray-100 hover:bg-gray-200" : "bg-yellow-600/30 hover:bg-yellow-600/50";

  // Generate initials for collapsed view
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block fixed h-full top-0 left-0 z-30 transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        } ${styles.desktop}`}
      >
        {/* Logo and Toggle */}
        <div
          className={`h-20 px-4 flex items-center border-b ${borderColor} ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!isCollapsed && <img src="/src/assets/LogoWithName1.png" alt="Logo" className="h-8" />}

          <button
            onClick={toggleSidebar}
            className={`p-1 rounded-lg transition-colors ${hoverButton} ${textColor}`}
          >
            {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 px-4 mt-6">
          {menuItems.map((item) => (
            <NavLink
              key={`${item.label}-${item.to}`}
              to={item.to}
              className={({ isActive }) =>
                `capitalize px-3 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                  isActive ? styles.active : `${textColor} ${styles.hover}`
                } ${isCollapsed ? "justify-center" : ""}`
              }
              title={isCollapsed ? item.label : ""}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* --- Identification + Logout --- */}
        <div className={`absolute bottom-20 left-0 right-0 px-4`}>
          {!isCollapsed ? (
            <>
              <div className={`rounded-lg p-3 mb-3 bg-white/10 ${textColor}`}>
                <p className="font-semibold text-sm truncate">
                  {currentUser?.fullName ||currentUser?.name|| "Guest User"}
                </p>
                <p className="text-xs opacity-80 capitalize">{currentUser?.role || role}</p>
              </div>
              <button
                onClick={handleLogout}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg w-full ${bgButton} ${textColor} justify-center`}
              >
                <LogoutIcon fontSize="small" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            // Collapsed version - show just initials with tooltip
            <div className="flex flex-col items-center">
              <div
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-sm font-bold cursor-default"
                title={`${currentUser?.fullName ||currentUser?.name || "Guest"} (${currentUser?.role || role})`}
              >
                {getInitials(currentUser?.fullName ||currentUser?.name || "G")}
              </div>
              <button
                onClick={handleLogout}
                className={`mt-3 p-2 rounded-full ${bgButton} ${textColor}`}
                title="Logout"
              >
                <LogoutIcon fontSize="small" />
              </button>
            </div>
          )}
        </div>

        {/* Collapse Button */}
        <div className={`absolute bottom-4 left-0 right-0 px-4 ${isCollapsed ? "flex justify-center" : ""}`}>
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-lg transition-colors ${bgButton} ${textColor} ${
              isCollapsed ? "" : "w-full flex items-center gap-3 px-3"
            }`}
          >
            <MenuIcon />
            {!isCollapsed && <span>Collapse Menu</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
