import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Category as CategoryIcon,
  Payment as PaymentIcon,
  Help as SupportIcon,
  Assignment as PolicyIcon,
  Receipt as ClaimsIcon,
  Business as BusinessIcon,
  AccountBalance as FinanceIcon,
  Groups as TeamIcon,
  Task as TaskIcon,
} from "@mui/icons-material";

export interface MenuItem {
  label: string;
  to: string;
  icon: React.ReactElement;
}

export const MENU_CONFIG: Record<string, MenuItem[]> = {
  admin: [
    { label: "Dashboard", to: "/admindash", icon: <DashboardIcon /> },
    { label: "User Management", to: "/UserManagment", icon: <PeopleIcon /> },
    { label: "Category Management", to: "/catagoyinadmin", icon: <CategoryIcon /> },
    { label: "Policy", to: "/payment", icon: <PaymentIcon /> },
    { label: "Report", to: "/support", icon: <SupportIcon /> },
  ],
  
  customer: [
    { label: "Dashboard", to: "/customerdash", icon: <DashboardIcon /> },
    { label: "Policy", to: "/policy", icon: <PolicyIcon /> },
    { label: "Claims", to: "/claims", icon: <ClaimsIcon /> },
    { label: "Payment", to: "/payment", icon: <PaymentIcon /> },
    { label: "My Profile", to: "/support", icon: <SupportIcon /> },
  ],
  
  finance: [
    { label: "Dashboard", to: "/financedash", icon: <DashboardIcon /> },
    { label: "Financial Reports", to: "/finance-reports", icon: <FinanceIcon /> },
    { label: "Payment Processing", to: "/payment-processing", icon: <PaymentIcon /> },
    { label: "Invoices", to: "/support", icon: <SupportIcon /> },
  ],
  
  manager: [
    { label: "Dashboard", to: "/managerdash", icon: <DashboardIcon /> },
    { label: "Team Management", to: "/team-management", icon: <TeamIcon /> },
    { label: "Performance", to: "/performance", icon: <TeamIcon /> },
    { label: "Support", to: "/support", icon: <SupportIcon /> },
  ],
  
  operator: [
    { label: "Dashboard", to: "/operatingdash", icon: <DashboardIcon /> },
    { label: "Operations", to: "/operations", icon: <BusinessIcon /> },
    { label: "Task Management", to: "/tasks", icon: <TaskIcon /> },
    { label: "Support", to: "/support", icon: <SupportIcon /> },
  ],
};

export const STYLE_CONFIG: Record<string, { desktop: string; mobile: string; active: string; hover: string }> = {
  admin: {
    desktop: "bg-gradient-to-b from-[#b78f00] to-[#2c2000]",
    mobile: "bg-gradient-to-b from-[#b78f00] to-[#2c2000]",
    active: "bg-[#FFC233] text-black",
    hover: "hover:bg-yellow-200/50",
  },
  customer: {
    desktop: "bg-gradient-to-b from-[#b78f00] to-[#2c2000]",
    mobile: "bg-gradient-to-b from-[#b78f00] to-[#2c2000]",
    active: "bg-[#FFC233] text-black",
    hover: "hover:bg-yellow-200/50",
  },
  finance: {
    desktop: "bg-gradient-to-b from-[#059669] to-[#064e3b]",
    mobile: "bg-gradient-to-b from-[#059669] to-[#064e3b]",
    active: "bg-green-300 text-black",
    hover: "hover:bg-green-200/50",
  },
  manager: {
    desktop: "bg-gradient-to-b from-[#0369a1] to-[#0c4a6e]",
    mobile: "bg-gradient-to-b from-[#0369a1] to-[#0c4a6e]",
    active: "bg-blue-300 text-black",
    hover: "hover:bg-blue-200/50",
  },
  operator: {
    desktop: "bg-white shadow-lg",
    mobile: "bg-gradient-to-b from-[#b78f00] to-[#2c2000]",
    active: "bg-[#FFC233] text-black",
    hover: "hover:bg-yellow-200/50",
  },
}; 