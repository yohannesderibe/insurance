// // // src/pages/LoginPage.tsx
// // import React, { useState } from "react";
// // import { useAuth } from "../../context/AuthContext"; // Auth provider (we create this)
// // import { useNavigate } from "react-router-dom";

// // const LoginPage: React.FC = () => {
// //   const { login } = useAuth(); // call our context
// //   const navigate = useNavigate();

// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [error, setError] = useState("");

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setError("");
// //     try {
// //       await login(email, password); // calls API from context
// //       navigate("/dashboard"); // redirect after login
// //     } catch (err: any) {
// //       setError("Invalid email or password.");
// //     }
// //   };

// //   return (
// //     <div
// //       className="min-h-screen flex items-center justify-center bg-cover bg-center"
// //       // ⬇️ Background image goes in public/assets/bg-login.jpg
// //       style={{ backgroundImage: "url('/assets/login.jpg')" }}
// //     >
// //       <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
// //         {/* ⬇️ Logo goes in public/assets/logo.png */}
// //         <div className="flex justify-center mb-6">
// //           <img
// //             src="/assets/logo.png"
// //             alt="Bee Insurance Logo"
// //             className="h-16 w-auto"
// //           />
// //         </div>

// //         <h2 className="text-2xl font-bold text-center mb-6 text-yellow-600">
// //           Login
// //         </h2>

// //         {error && (
// //           <div className="mb-4 text-red-500 text-center font-medium">
// //             {error}
// //           </div>
// //         )}

// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           {/* Email */}
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700">
// //               Email
// //             </label>
// //             <input
// //               type="email"
// //               value={email}
// //               onChange={(e) => setEmail(e.target.value)}
// //               className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
// //               required
// //             />
// //           </div>

// //           {/* Password */}
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700">
// //               Password
// //             </label>
// //             <input
// //               type="password"
// //               value={password}
// //               onChange={(e) => setPassword(e.target.value)}
// //               className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
// //               required
// //             />
// //           </div>

// //           {/* Button */}
// //           <button
// //             type="submit"
// //             className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition-colors"
// //           >
// //             Login
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default LoginPage;// src/pages/LoginPage.tsx
// import React, { useState } from "react";
// import EmailField from "../../reusable/input/EmailField";
// import PasswordField from "../../reusable/input/PasswordField";
// import logo from "../../assets/bee-logo.png";
// import bgImage from "../../assets/login.png";
// import { useNavigate } from "react-router-dom";
// import authApi from "../../api/auth/auth"; // Import the auth API

// const LoginPage: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (!email || !password) {
//       setError("Email and Password are required");
//       return;
//     }

//     try {
//       setLoading(true);

//       // Use real API instead of mock
//       const response = await authApi.login(email, password);
      
//       // Store token and user data
//       localStorage.setItem("token", response.token);
//       localStorage.setItem("user", JSON.stringify(response.user));
      
//       navigate("/dashboard");
//     }  catch (err: unknown) {
//   if (err instanceof Error) {
//     setError(err.message);
//   } else {
//     setError("Login failed");
//   }
// }

//   };

//   return (
//     <div
//       className="h-screen w-screen flex items-center justify-center bg-cover bg-center"
//       style={{ backgroundImage: `url(${bgImage})` }}
//     >
//       <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
//         <div className="flex flex-col items-center mb-6">
//           <img src={logo} alt="Logo" className="h-16 w-16 mb-2" />
//           <h1 className="text-lg font-bold text-gray-700">Welcome Back 👋</h1>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <EmailField value={email} onChange={(e) => setEmail(e.target.value)} />
//           <PasswordField
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           {error && <p className="text-red-600 text-sm">{error}</p>}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-yellow-400 text-white py-3 rounded-md font-medium hover:bg-yellow-500 transition disabled:opacity-50"
//           >
//             {loading ? "Signing In..." : "Sign In"}
//           </button>

//           <div className="flex justify-between items-center text-sm text-gray-500">
//             <a href="/forgot-password" className="hover:text-yellow-500">
//               Forgot Password?
//             </a>
//             <a href="/register" className="hover:text-yellow-500">
//               Create Account
//             </a>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

//try3
// src/pages/LoginPage.tsx
import React, { useState } from "react";
import EmailField from "../../reusable/input/EmailField";
import PasswordField from "../../reusable/input/PasswordField";
import logo from "../../assets/bee-logo.png";
import bgImage from "../../assets/login.png";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/auth/auth"; 
import { jwtDecode } from "jwt-decode"; // ✅ add this

// Define the shape of your token payload
interface DecodedToken {
  role?: string;
  exp?: number;
  [key: string]: string|number|undefined; // for any other claims
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ role → route mapping
     const roleRoutes: Record<string, string> = {
      superadmin: "/admin-dash",
      admin: "/admindash",
      manager: "/managerdash",
      operator: "/operatingdash",     // map Operator → operator
      operatingofficer: "/operatingdash",
      finance: "/financedash",
      client: "/coustmerdash",
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and Password are required");
      return;
    }

    try {
      setLoading(true);

      // Call real API
      const response = await authApi.login(email, password);
      console.log("🔑 API Response:", response);

      // Save token + user
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // ✅ Decode JWT
      const decoded: DecodedToken = jwtDecode(response.token);
      console.log("📜 Decoded JWT:", decoded);

      // Role comes from token first, fallback to response.user
const roleFromToken =
      decoded.role ||
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"];     
      
      const roleFromUser = response.user?.role;
const rawRole = roleFromToken || roleFromUser || "";
const role = String(rawRole).toLowerCase(); // ✅ Fix: always a string
      console.log("🎭 Role from token:", roleFromToken);
      console.log("👤 Role from user object:", roleFromUser);
      console.log("✅ Final resolved role:", role);

      if (role && roleRoutes[role]) {
        console.log(`🚀 Redirecting to: ${roleRoutes[role]}`);
        navigate(roleRoutes[role]);
      } else {
        console.warn("⚠️ Unknown role, cannot redirect:", role);
        setError("Unknown or unsupported user role");
      }
    } catch (err: unknown) {
      console.error("❌ Login error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="h-16 w-16 mb-2" />
          <h1 className="text-lg font-bold text-gray-700">
            Welcome To NIB Insurance 👋
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <EmailField value={email} onChange={(e) => setEmail(e.target.value)} />
          <PasswordField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-white py-3 rounded-md font-medium hover:bg-yellow-500 transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="flex justify-between items-center text-sm text-gray-500">
            <a href="/forgot-password" className="hover:text-yellow-500">
              Forgot Password?
            </a>
            <a href="/selfcreatedclient" className="hover:text-yellow-500">
              Create Account
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
