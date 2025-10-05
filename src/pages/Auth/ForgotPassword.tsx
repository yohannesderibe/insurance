// src/pages/ForgotPasswordPage.tsx
import React, { useState } from "react";
import logo from "../../assets/bee-logo.png";
import bgImage from "../../assets/login.png";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/auth/auth";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);
      await authApi.forgotPassword(email); // API call to request OTP
      setMessage("✅ OTP has been sent to your email.");
      navigate("/otp", { state: { email } });
    } catch (err: unknown) {
      setError("❌ Failed to send OTP. Try again.");
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
          <h1 className="text-lg font-bold text-gray-700">Forgot Password 🔑</h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter your email to receive an OTP.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-white py-3 rounded-md font-medium hover:bg-yellow-500 transition disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          <div className="text-center text-sm mt-3">
            <a href="/" className="text-gray-500 hover:text-yellow-500">
              ← Back to Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
