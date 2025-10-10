// import React, {lazy} from "react";
// import {Routes,Route} from 'react-router-dom';

// // import React, {lazy,useState} from "react";
// // import {Routes,Route,Navigate} from 'react-router-dom';
// // first page or every one that can see with out loging in 
// const FirstPage = lazy(()=> import('../pages/FirstPage'));
// const SignIn = lazy(()=> import('../pages/Auth/signin'));
// const Dash = lazy(()=> import('../pages/1/dash'));
// const Otp=lazy(()=> import('../pages/Auth/OTPForm'));
// const ForgetPassword=lazy(()=> import('../pages/Auth/ForgotPassword'));
// const ChangePassword=lazy(()=> import('../pages/Auth/ChangePassword'));
// const SelfRegistedClient =lazy(()=>import('../pages/Auth/SelfRegisteredClient'))
// //Admin
// const AdminDash = lazy(()=> import('../pages/Actors/Admin/AdminDash'));
// const AdminUserManagment = lazy(()=> import('../pages/Actors/Admin/User-managment/UserManagementPage'));
// const CatagoryInAdmin = lazy(()=> import('../pages/Actors/Admin/Catagory-Managemnt/CatagoryInAdmin'));
// //manager
// const ManagerDash = lazy(()=> import('../pages/Actors/Manager/ManagerDash'));


// //coustomer
// const CoustmerDash = lazy(()=> import('../pages/Actors/Coustmer/CoustmerDash'));


// //operating officer 
// const OperatingDash = lazy(()=> import('../pages/Actors/OperatingOfficer/OpDash'));


// //finance officer
// const FinanceDash = lazy(()=> import('../pages/Actors/Finance/FinanceDash'));


// const AppRoutes:React.FC = () => {
//     return(
//         <Routes>
//             <Route path= "/" element ={<FirstPage />} />
//             <Route path= "/Startpage" element ={<FirstPage />} />
//             <Route path= "/login" element ={<SignIn />} />
//             <Route path= "/dashboard" element ={<Dash />} />
//             <Route path= "/otp" element ={<Otp />} />
//             <Route path= "/forgot-password" element ={<ForgetPassword />} />
//             <Route path= "/reset-password" element ={<ChangePassword />} />
//             <Route path="/selfcreatedclient" element={<SelfRegistedClient />} />
//             {/* admin */}
//                 <Route path= "/admindash" element ={<AdminDash />} />
//                 <Route path= "/UserManagment" element ={<AdminUserManagment />} />
//                 <Route path= "/catagoyinadmin" element ={<CatagoryInAdmin />} />

//             {/* coustmer */}
//                 <Route path= "/coustmerdash" element ={<CoustmerDash />} />


//             {/* operating officer */}
//                 <Route path= "/operatingdash" element ={<OperatingDash />} />


//             {/* finance officer */}
//                 <Route path= "/financedash" element ={<FinanceDash />} />

//             {/* manager */}
//                 <Route path= "/managerdash" element ={<ManagerDash />} />


//         </Routes>
//     );
// };

// export default AppRoutes;
import React, { lazy, Suspense, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Type definitions
type Role = 'admin' | 'customer' | 'finance' | 'manager' | 'operator';

// Lazy-loaded components
const FirstPage = lazy(() => import('../pages/FirstPage'));
const SignIn = lazy(() => import('../pages/Auth/signin'));
const Dash = lazy(() => import('../pages/1/dash'));
const Otp = lazy(() => import('../pages/Auth/OTPForm'));
const ForgetPassword = lazy(() => import('../pages/Auth/ForgotPassword'));
const ChangePassword = lazy(() => import('../pages/Auth/ChangePassword'));
const SelfRegistedClient = lazy(() => import('../pages/Auth/SelfRegisteredClient'));

// Admin Pages
const AdminDash = lazy(() => import('../pages/Actors/Admin/AdminDash'));
const AdminUserManagment = lazy(() => import('../pages/Actors/Admin/User-managment/UserManagementPage'));
const CatagoryInAdmin = lazy(() => import('../pages/Actors/Admin/Catagory-Managemnt/CatagoryInAdmin'));

// Manager Pages
const ManagerDash = lazy(() => import('../pages/Actors/Manager/ManagerDash'));

// Customer Pages
const CoustmerDash = lazy(() => import('../pages/Actors/Coustmer/CoustmerDash'));

// Operating Officer Pages
const OperatingDash = lazy(() => import('../pages/Actors/OperatingOfficer/OpDash'));

// Finance Officer Pages
const FinanceDash = lazy(() => import('../pages/Actors/Finance/FinanceDash'));

// Sidebars for different roles
const AdminSidebar = lazy(() => import('../components/Bars/SideBars/Admin'));
const CustomerSidebar = lazy(() => import('../components/Bars/SideBars/Customer'));
const FinanceSidebar = lazy(() => import('../components/Bars/SideBars/Finance'));
const ManagerSidebar = lazy(() => import('../components/Bars/SideBars/Manager'));
const OperatorSidebar = lazy(() => import('../components/Bars/SideBars/Operating'));

// TopBar
// const TopBar = lazy(() => import('../components/Bars/TopBar'));

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: Role;
  SidebarComponent: React.ComponentType<any>;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  role, 
  SidebarComponent 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarCollapse = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-amber-50/50 to-yellow-50/50">
      {/* Sidebar */}
      <SidebarComponent 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onCollapse={handleSidebarCollapse}
      />
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-20 p-4 border-b border-amber-200">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-amber-100 text-amber-700"
          >
            ☰
          </button>
          <h1 className="text-lg font-bold text-amber-900">
            {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
          </h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${
        isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
      } pt-16 md:pt-0`}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

interface ProtectedRouteWrapperProps {
  role: Role;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
}

const ProtectedRouteWrapper: React.FC<ProtectedRouteWrapperProps> = ({ 
  role, 
  component: Component 
}) => {
  // Map roles to their respective sidebar components
  const getSidebarComponent = (): React.ComponentType<any> => {
    switch (role) {
      case 'admin': return AdminSidebar;
      case 'customer': return CustomerSidebar;
      case 'finance': return FinanceSidebar;
      case 'manager': return ManagerSidebar;
      case 'operator': return OperatorSidebar;
      default: return AdminSidebar;
    }
  };

  const SidebarComponent = getSidebarComponent();

  return (
      <DashboardLayout role={role} SidebarComponent={SidebarComponent}>
        <Component />
      </DashboardLayout>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    }>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<FirstPage />} />
        <Route path="/Startpage" element={<FirstPage />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/dashboard" element={<Dash />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ChangePassword />} />
        <Route path="/selfcreatedclient" element={<SelfRegistedClient />} />

        {/* Admin Routes */}
        <Route 
          path="/admindash" 
          element={<ProtectedRouteWrapper role="admin" component={AdminDash} />} 
        />
        <Route 
          path="/UserManagment" 
          element={<ProtectedRouteWrapper role="admin" component={AdminUserManagment} />} 
        />
        <Route 
          path="/catagoyinadmin" 
          element={<ProtectedRouteWrapper role="admin" component={CatagoryInAdmin} />} 
        />

        {/* Customer Routes */}
        <Route 
          path="/customerdash" 
          element={<ProtectedRouteWrapper role="customer" component={CoustmerDash} />} 
        />

        {/* Operating Officer Routes */}
        <Route 
          path="/operatingdash" 
          element={<ProtectedRouteWrapper role="operator" component={OperatingDash} />} 
        />

        {/* Finance Officer Routes */}
        <Route 
          path="/financedash" 
          element={<ProtectedRouteWrapper role="finance" component={FinanceDash} />} 
        />

        {/* Manager Routes */}
        <Route 
          path="/managerdash" 
          element={<ProtectedRouteWrapper role="manager" component={ManagerDash} />} 
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;