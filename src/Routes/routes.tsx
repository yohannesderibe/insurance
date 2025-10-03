import React, {lazy} from "react";
import {Routes,Route} from 'react-router-dom';

// import React, {lazy,useState} from "react";
// import {Routes,Route,Navigate} from 'react-router-dom';
// first page or every one that can see with out loging in 
const FirstPage = lazy(()=> import('../pages/FirstPage'));
const SignIn = lazy(()=> import('../pages/Auth/signin'));
const Dash = lazy(()=> import('../pages/1/dash'));
const Otp=lazy(()=> import('../pages/Auth/OTPForm'));
const ForgetPassword=lazy(()=> import('../pages/Auth/ForgotPassword'));
const ChangePassword=lazy(()=> import('../pages/Auth/ChangePassword'));
//Admin
const AdminDash = lazy(()=> import('../pages/Actors/Admin/AdminDash'));


//manager
const ManagerDash = lazy(()=> import('../pages/Actors/Manager/ManagerDash'));


//coustomer
const CoustmerDash = lazy(()=> import('../pages/Actors/Coustmer/CoustmerDash'));


//operating officer 
const OperatingDash = lazy(()=> import('../pages/Actors/OperatingOfficer/OpDash'));


//finance officer
const FinanceDash = lazy(()=> import('../pages/Actors/Finance/FinanceDash'));


const AppRoutes:React.FC = () => {
    return(
        <Routes>
            <Route path= "/" element ={<FirstPage />} />
            <Route path= "/Startpage" element ={<FirstPage />} />
            <Route path= "/login" element ={<SignIn />} />
            <Route path= "/dashboard" element ={<Dash />} />
            <Route path= "/otp" element ={<Otp />} />
            <Route path= "/forgot-password" element ={<ForgetPassword />} />
            <Route path= "/reset-password" element ={<ChangePassword />} />
            {/* admin */}
                <Route path= "/admindash" element ={<AdminDash />} />



            {/* coustmer */}
                <Route path= "/coustmerdash" element ={<CoustmerDash />} />


            {/* operating officer */}
                <Route path= "/operatingdash" element ={<OperatingDash />} />


            {/* finance officer */}
                <Route path= "/financedash" element ={<FinanceDash />} />

            {/* manager */}
                <Route path= "/managerdash" element ={<ManagerDash />} />


        </Routes>
    );
};

export default AppRoutes;