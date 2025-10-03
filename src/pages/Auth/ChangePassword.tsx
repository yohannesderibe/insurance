import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import logo from "../../assets/bee-logo.png";
import bgImage from "../../assets/login.png";
import authApi from "../../api/auth/auth";

const ResetPasswordPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as { email: string })?.email || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || !confirm) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      // ✅ Updated to match API - only email and newPassword required
      await authApi.resetPassword(email, password);
      navigate("/", { 
        state: { 
          message: "✅ Password reset successfully! Please login with your new password." 
        } 
      });
    } catch (error: any) {
      setError(error.message || "❌ Failed to reset password. Try again.");
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
          <h1 className="text-lg font-bold text-gray-700">Create Your New Password 🔑</h1>
          <p className="text-sm text-gray-500 mt-1 text-center">
            We verified the code for <span className="font-medium">{email}</span>.  
            Please create a new password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              required
              minLength={6}
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Re-enter your new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              required
              minLength={6}
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-white py-3 rounded-md font-medium hover:bg-yellow-500 transition disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;