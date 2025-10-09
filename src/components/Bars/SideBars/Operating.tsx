// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import CloseIcon from "@mui/icons-material/Close";
// import MenuIcon from "@mui/icons-material/Menu";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import PolicyIcon from "@mui/icons-material/Assignment";
// import ClaimsIcon from "@mui/icons-material/Receipt";
// import PaymentIcon from "@mui/icons-material/Payment";
// import SupportIcon from "@mui/icons-material/Help";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// interface SidebarProps {
//   open: boolean;
//   onClose: () => void;
//   onCollapse?: (collapsed: boolean) => void;
// }

// interface MenuItem {
//   label: string;
//   to: string;
//   icon: React.ReactElement;
// }

// const OPMenu: MenuItem[] = [
//   { label: "dashboard", to: "/opDash", icon: <DashboardIcon /> },
//   { label: "op", to: "/policy", icon: <PolicyIcon /> },
//   { label: "op", to: "/claims", icon: <ClaimsIcon /> },
//   { label: "payment", to: "/payment", icon: <PaymentIcon /> },
//   { label: "support", to: "/support", icon: <SupportIcon /> },
// ];

// const OPSidebar: React.FC<SidebarProps> = ({ open, onClose, onCollapse }) => {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const toggleSidebar = () => {
//     const newCollapsedState = !isCollapsed;
//     setIsCollapsed(newCollapsedState);
//     onCollapse?.(newCollapsedState);
//   };

//   return (
//     <>
//       {/* Desktop Sidebar */}
//       <aside 
//         className={`hidden md:block fixed h-full bg-white shadow-lg top-0 left-0 z-30 transition-all duration-300 ${
//           isCollapsed ? "w-16" : "w-64"
//         }`}
//       >
//         {/* Logo and Toggle */}
//         <div className={`h-20 px-4 flex items-center border-b border-yellow-700 ${
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
//             className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
//             aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
//           >
//             {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex flex-col gap-2 px-4 mt-6">
//           {OPMenu.map((item) => (
//             <NavLink
//               key={item.label}
//               to={item.to}
//               className={({ isActive }) =>
//                 `capitalize px-3 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
//                   isActive
//                     ? "bg-[#FFC233] text-black"
//                     : "text-black hover:bg-yellow-200/50"
//                 } ${isCollapsed ? "justify-center" : ""}`
//               }
//               title={isCollapsed ? item.label : ""}
//             >
//               <span className="flex-shrink-0">{item.icon}</span>
//               {!isCollapsed && <span>{item.label}</span>}
//             </NavLink>
//           ))}
//         </nav>

//         {/* Hamburger Menu Button (Bottom) */}
//         <div className={`absolute bottom-4 left-0 right-0 px-4 ${
//           isCollapsed ? "flex justify-center" : ""
//         }`}>
//           <button
//             onClick={toggleSidebar}
//             className={`p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors ${
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

//           <aside className={`absolute left-0 top-0 h-full bg-gradient-to-b from-[#b78f00] to-[#2c2000] z-50 transition-transform ${
//             isCollapsed ? "w-16" : "w-64"
//           }`}>
//             {/* Logo + Close + Toggle */}
//             <div className={`h-20 px-4 flex items-center border-b border-yellow-700 relative ${
//               isCollapsed ? "justify-center" : "justify-between"
//             }`}>
//               {!isCollapsed && (
//                 <img src="/src/assets/niblogo.svg" alt="Logo" className="h-10" />
//               )}
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={toggleSidebar}
//                   className="p-1 rounded-lg hover:bg-yellow-600/30 transition-colors text-white"
//                   aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
//                 >
//                   {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
//                 </button>
//                 {!isCollapsed && (
//                   <button
//                     className="p-1 rounded-lg hover:bg-yellow-600/30 transition-colors text-white"
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
//               {OPMenu.map((item) => (
//                 <NavLink
//                   key={item.label}
//                   to={item.to}
//                   onClick={onClose}
//                   className={({ isActive }) =>
//                     `capitalize px-3 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
//                       isActive
//                         ? "bg-[#FFC233] text-black"
//                         : "text-white hover:bg-yellow-600/30"
//                     } ${isCollapsed ? "justify-center" : ""}`
//                   }
//                   title={isCollapsed ? item.label : ""}
//                 >
//                   <span className="flex-shrink-0">{item.icon}</span>
//                   {!isCollapsed && <span>{item.label}</span>}
//                 </NavLink>
//               ))}
//             </nav>

//             {/* Hamburger Menu Button (Bottom - Mobile) */}
//             <div className={`absolute bottom-4 left-0 right-0 px-4 ${
//               isCollapsed ? "flex justify-center" : ""
//             }`}>
//               <button
//                 onClick={toggleSidebar}
//                 className={`p-2 rounded-lg bg-yellow-600/30 hover:bg-yellow-600/50 transition-colors text-white ${
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

// export default OPSidebar;
import Sidebar from "./Allside";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onCollapse?: (collapsed: boolean) => void;
}

const OperatorSidebar: React.FC<SidebarProps> = (props) => {
  return <Sidebar {...props} role="operator" />;
};

export default OperatorSidebar;