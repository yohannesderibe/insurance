import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/bee-logo.png";
import bgImage from "../../assets/login.png";
import authApi from "../../api/auth/auth";

const OtpVerificationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as { email: string })?.email || "";

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        (document.getElementById(`otp-${index + 1}`) as HTMLInputElement)?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    try {
      setLoading(true);
      // ✅ Use verifyOtp API call instead of forgotPassword
      const res = await authApi.verifyOtp(email, enteredOtp);
      if (res.success) {
        navigate("/reset-password", { state: { email } });
      } else {
        setError("❌ Invalid or expired OTP.");
      }
    } catch (error: any) {
      setError(error.message || "❌ Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setError("");
      const res = await authApi.resendOtp(email);
      if (res.success) {
        setTimer(60);
        setCanResend(false);
        setOtp(Array(6).fill(""));
        setError("✅ New OTP sent successfully!");
        // Focus on first OTP input
        (document.getElementById(`otp-0`) as HTMLInputElement)?.focus();
      }
    } catch (error: any) {
      setError(error.message || "❌ Failed to resend OTP.");
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
          <h1 className="text-lg font-bold text-gray-700">Check your inbox 📩</h1>
          <p className="text-sm text-gray-500 mt-1 text-center">
            We sent a 6-digit code to <span className="font-medium">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-lg focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            ))}
          </div>

          {error && (
            <p className={`text-sm ${error.includes("✅") ? "text-green-600" : "text-red-600"}`}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-white py-3 rounded-md font-medium hover:bg-yellow-500 transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Continue"}
          </button>

          <div className="text-center text-sm text-gray-500 mt-3">
            Code sent. Should arrive in 00:{timer.toString().padStart(2, "0")}
            <br />
            Didn't get it?{" "}
            {canResend ? (
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-yellow-500 hover:underline focus:outline-none"
              >
                Resend
              </button>
            ) : (
              <span className="text-gray-400">Resend</span>
            )}
          </div>

          <div className="text-center text-sm mt-2">
            <a href="/" className="text-gray-500 hover:text-yellow-500">
              Back to Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpVerificationPage;