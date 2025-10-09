// import React from "react";
// import { NavLink } from "react-router-dom";
// import CloseIcon from "@mui/icons-material/Close";
// // import { useAuth } from "../../context/AuthContext";

// interface SidebarProps {
//   open: boolean;
//   onClose: () => void;
// }

// const ManMenu = [
//   { label: "dashboard", to: "/customerdash" },
//   { label: "policy", to: "/policy" },
//   { label: "claims", to: "/claims" },
//   { label: "payment", to: "/payment" },
//   { label: "support", to: "/support" },
// ];

// const ManagerSidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
// //   const { user } = useAuth();

//   return (
//     <>
//       {/* Desktop Sidebar */}
//       <aside className="hidden md:block fixed w-64 h-full bg-gradient-to-b from-[#b78f00] to-[#2c2000] top-0 left-0 z-30">
//         {/* Logo */}
//         <div className="h-20 px-4 flex justify-center items-center border-b border-yellow-700">
//           {/* replace with your logo */}
//           <img src="/src/assets/LogoWithName1.png" alt="Logo" className="h-35" />
//         </div>

//         {/* Navigation */}
//         <nav className="flex flex-col gap-4 px-6 mt-6">
//           {ManMenu.map((item) => (
//             <NavLink
//               key={item.label}
//               to={item.to}
//               className={({ isActive }) =>
//                 `capitalize px-4 py-2 rounded-2xl text-sm font-medium transition-all ${
//                   isActive
//                     ? "bg-[#FFC233] text-black"
//                     : "text-black hover:bg-yellow-200/50"
//                 }`
//               }
//             >
//               {item.label}
//             </NavLink>
//           ))}
//         </nav>
//       </aside>

//       {/* Mobile Sidebar */}
//       {open && (
//         <div className="fixed inset-0 z-40 md:hidden">
//           <div className="fixed inset-0 bg-black/40" onClick={onClose}></div>

//           <aside className="absolute left-0 top-0 w-64 h-full bg-gradient-to-b from-[#b78f00] to-[#2c2000] z-50 transition-transform">
//             {/* Logo + Close */}
//             <div className="h-20 px-4 flex justify-center items-center border-b border-yellow-700 relative">
//               <img src="/src/assets/niblogo.svg" alt="Logo" className="h-10 mx-auto" />
//               <button
//                 className="absolute right-4 text-black"
//                 onClick={onClose}
//                 aria-label="close"
//               >
//                 <CloseIcon />
//               </button>
//             </div>

//             <nav className="flex flex-col gap-4 px-6 mt-6">
//               {ManMenu.map((item) => (
//                 <NavLink
//                   key={item.label}
//                   to={item.to}
//                   onClick={onClose}
//                   className={({ isActive }) =>
//                     `capitalize px-4 py-2 rounded-2xl text-sm font-medium transition-all ${
//                       isActive
//                         ? "bg-[#FFC233] text-black"
//                         : "text-black hover:bg-yellow-200/50"
//                     }`
//                   }
//                 >
//                   {item.label}
//                 </NavLink>
//               ))}
//             </nav>
//           </aside>
//         </div>
//       )}
//     </>
//   );
// };

// export default ManagerSidebar;
import Sidebar from "./Allside";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onCollapse?: (collapsed: boolean) => void;
}

const ManagerSidebar: React.FC<SidebarProps> = (props) => {
  return <Sidebar {...props} role="manager" />;
};

export default ManagerSidebar; 