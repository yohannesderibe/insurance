import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/login.png";
import PasswordField from "../../reusable/input/PasswordField";
import { FiMail, FiPhone, FiUser } from "react-icons/fi";
import cityData from "../../data/cities.json";
import beeLogo from "../../assets/bee-logo.png";
import api from "../../api/axios";

interface CityData {
  name: string;
  sub_cities: string[];
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "Ethiopia",
    city: "",
    subCity: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "city") {
      setFormData((prev) => ({ ...prev, subCity: "" }));
    }
  };

  const validatePasswords = () => {
    const newErrors = { password: "", confirmPassword: "" };

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Include at least one uppercase letter.";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Include at least one number.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return !newErrors.password && !newErrors.confirmPassword;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswords()) return;

    setIsLoading(true);

    try {
      const form = new FormData();
      form.append("Id", crypto.randomUUID());
      form.append("UserName", formData.email);
      form.append("Email", formData.email);
      form.append("PasswordHash", formData.password);
      form.append("FullName", formData.fullName);
      form.append("MobilePhone", formData.phone);
      form.append("IsActive", "true");
      form.append("Region", formData.country);
      form.append("City", formData.city);
      form.append("SubCity", formData.subCity);
      form.append("Latitude", "0");
      form.append("Longitude", "0");
      form.append("LogoImageUrl", "string");

      const response = await api.post("/Client/register", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Registered successfully:", response.data);
      setIsSuccess(true);
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (error) {
      console.error("❌ Registration error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const cities: CityData[] = cityData.cities;
  const selectedCity = cities.find((c) => c.name === formData.city);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4 relative" // Added relative here
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* ✅ Success Modal - MOVED OUTSIDE the form container */}
      {isSuccess && (
        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-50">
          <div className="text-center">
           <div className="text-orange-400 mb-4">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-16 h-16 mx-auto"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
</div>

            <p className="text-lg font-semibold">Registration successful!</p>
            <p className="text-gray-600 mt-2">Redirecting to login page...</p>
          </div>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white/95 shadow-2xl rounded-xl p-6 w-full max-w-md backdrop-blur-sm border border-amber-100">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <img src={beeLogo} alt="Bee Logo" className="w-10 h-10" />
          <div>
            <h2 className="text-xl font-bold text-gray-800">Join the Hive</h2>
            <p className="text-gray-600 text-xs">Create your account</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Full Name + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <FiUser className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full pl-7 pr-2 py-2 text-sm border border-gray-300 rounded-lg focus:border-amber-400 focus:ring-1 focus:ring-amber-300 outline-none"
              />
            </div>
            <div className="relative">
              <FiPhone className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full pl-7 pr-2 py-2 text-sm border border-gray-300 rounded-lg focus:border-amber-400 focus:ring-1 focus:ring-amber-300 outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <FiMail className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-7 pr-2 py-2 text-sm border border-gray-300 rounded-lg focus:border-amber-400 focus:ring-1 focus:ring-amber-300 outline-none"
            />
          </div>

          {/* Country + City */}
          <div className="grid grid-cols-2 gap-3">
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:border-amber-400 focus:ring-1 focus:ring-amber-300 bg-white"
            >
              <option value="Ethiopia">Ethiopia</option>
            </select>

            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:border-amber-400 focus:ring-1 focus:ring-amber-300 bg-white"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sub-City */}
          {selectedCity && (
            <select
              name="subCity"
              value={formData.subCity}
              onChange={handleChange}
              required
              className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:border-amber-400 focus:ring-1 focus:ring-amber-300 bg-white"
            >
              <option value="">Select Sub-City</option>
              {selectedCity.sub_cities.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          )}

          {/* Passwords */}
          <div className="space-y-2">
            <PasswordField
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              placeholder="Password"
              errorText={errors.password}
              compact={true}
            />
            <PasswordField
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              placeholder="Confirm Password"
              errorText={errors.confirmPassword}
              compact={true}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${
              isLoading ? "bg-amber-300 cursor-not-allowed" : "bg-amber-400 hover:bg-amber-500"
            } text-white font-medium py-2.5 rounded-lg transition duration-200 text-sm mt-2 flex items-center justify-center`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Registering...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            By registering, you agree to our{" "}
            <a href="#" className="text-amber-500 hover:text-amber-600 font-medium">
              Terms
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;