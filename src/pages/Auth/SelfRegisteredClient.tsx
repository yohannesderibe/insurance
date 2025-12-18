import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/login.png";
import PasswordField from "../../reusable/input/PasswordField";
import { FiMail, FiPhone, FiUser, FiCamera } from "react-icons/fi";
import { FaIdCard, FaUser, FaUserFriends, FaUserTie } from "react-icons/fa";
import cityData from "../../data/cities.json";
import beeLogo from "../../assets/bee-logo.png";
import clientApi from "../../api/auth/selfregistered";

interface RegisterClientPayload {
  firstName: string;
  fatherName: string;
  grandFatherName: string;
  email: string;
  phoneNumber: string;
  region: string;
  city: string;
  subCity: string;
  password: string;
  confirmPassword: string;
  nationalIdOrPassport: string;
  gender: string;
  passportImage: File;
}

interface CityData {
  name: string;
  sub_cities: string[];
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passportImage, setPassportImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  const [formData, setFormData] = useState({
    firstName: "",
    fatherName: "",
    grandFatherName: "",
    email: "",
    phone: "",
    country: "Ethiopia",
    city: "",
    subCity: "",
    password: "",
    confirmPassword: "",
    nationalIdOrPassport: "",
    gender: "Male",
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPassportImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
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

  const validateForm = () => {
    if (!validatePasswords()) return false;
    
    if (!formData.firstName.trim() || !formData.fatherName.trim() || !formData.grandFatherName.trim()) {
      alert("All name fields (First, Father, Grand Father) are required");
      return false;
    }
    
    if (!formData.email.trim()) {
      alert("Email is required");
      return false;
    }
    
    if (!formData.phone.trim()) {
      alert("Phone Number is required");
      return false;
    }
    
    if (!formData.nationalIdOrPassport.trim()) {
      alert("National ID or Passport is required");
      return false;
    }
    
    if (!passportImage) {
      alert("Passport or National ID Image is required");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const payload: RegisterClientPayload = {
        firstName: formData.firstName.trim(),
        fatherName: formData.fatherName.trim(),
        grandFatherName: formData.grandFatherName.trim(),
        email: formData.email,
        phoneNumber: formData.phone,
        region: formData.country,
        city: formData.city,
        subCity: formData.subCity,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        nationalIdOrPassport: formData.nationalIdOrPassport,
        gender: formData.gender,
        passportImage: passportImage!
      };

      console.log("📤 Sending registration data:", payload);
      
      const response = await clientApi.registerClient(payload);
      
      console.log("✅ Registered successfully:", response);
      setIsSuccess(true);
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (error: any) {
      console.error("❌ Registration error:", error);
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        errorMessage = "Validation errors:\n";
        Object.keys(validationErrors).forEach(key => {
          errorMessage += `• ${key}: ${validationErrors[key].join(', ')}\n`;
        });
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const cities: CityData[] = cityData.cities;
  const selectedCity = cities.find((c) => c.name === formData.city);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4 "
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* ✅ Success Modal */}
      {isSuccess && (
        <div className="fixed inset-0 bg-white/90 flex items-center justify-center z-50">
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

      {/* Form Container - Wider but compact height */}
      <div className="bg-white/95 shadow-2xl rounded-xl p-4 w-full max-w-lg backdrop-blur-sm border border-amber-100 ">
        {/* Header - Compact */}
        <div className="flex items-center space-x-3 mb-3">
          <img src={beeLogo} alt="Bee Logo" className="w-8 h-8" />
          <div>
            <h2 className="text-lg font-bold text-gray-800">Join the Hive</h2>
            <p className="text-gray-600 text-xs">Create your account</p>
          </div>
        </div>

        {/* Form - Compact with tighter spacing */}
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* 3 Name Fields Side by Side - Compact */}
          <div className="grid grid-cols-3 gap-2">
            <div className="relative">
              <FaUser className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full pl-8 pr-2 py-3 text-xs border border-amber-300 rounded-lg shadow-[0_0_8px_rgba(255,193,7,0.25)] focus:shadow-[0_0_12px_rgba(255,193,7,0.45)] focus:border-amber-400 focus:ring-0 outline-none transition-shadow"
              />
            </div>
            <div className="relative">
              <FaUserFriends className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                name="fatherName"
                placeholder="Father Name"
                value={formData.fatherName}
                onChange={handleChange}
                required
                className="w-full pl-8 pr-2 py-3 text-xs border border-amber-300 rounded-lg shadow-[0_0_8px_rgba(255,193,7,0.25)] focus:shadow-[0_0_12px_rgba(255,193,7,0.45)] focus:border-amber-400 focus:ring-0 outline-none transition-shadow"
              />
            </div>
            <div className="relative">
              <FaUserTie className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                name="grandFatherName"
                placeholder="Grand Father Name"
                value={formData.grandFatherName}
                onChange={handleChange}
                required
                className="w-full pl-8 pr-2 py-3 text-xs border border-amber-300 rounded-lg shadow-[0_0_8px_rgba(255,193,7,0.25)] focus:shadow-[0_0_12px_rgba(255,193,7,0.45)] focus:border-amber-400 focus:ring-0 outline-none transition-shadow"
              />
            </div>
          </div>

          {/* Email & Phone - Compact */}
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <FiMail className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-8 pr-2 py-3 text-xs border border-amber-300 rounded-lg shadow-[0_0_8px_rgba(255,193,7,0.25)] focus:shadow-[0_0_12px_rgba(255,193,7,0.45)] focus:border-amber-400 focus:ring-0 outline-none transition-shadow"
              />
            </div>
            <div className="relative">
              <FiPhone className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full pl-8 pr-2 py-3 text-xs border border-amber-300 rounded-lg shadow-[0_0_8px_rgba(255,193,7,0.25)] focus:shadow-[0_0_12px_rgba(255,193,7,0.45)] focus:border-amber-400 focus:ring-0 outline-none transition-shadow"
              />
            </div>
          </div>

          {/* Password and Confirm Password Side by Side - Compact */}
          <div className="grid grid-cols-2 gap-2">
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

          {/* National ID/Passport - Compact */}
          <div className="relative">
            <FaIdCard className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              name="nationalIdOrPassport"
              placeholder="National ID or Passport Number"
              value={formData.nationalIdOrPassport}
              onChange={handleChange}
              required
              className="w-full pl-8 pr-2 py-3 text-xs border border-amber-300 rounded-lg shadow-[0_0_8px_rgba(255,193,7,0.25)] focus:shadow-[0_0_12px_rgba(255,193,7,0.45)] focus:border-amber-400 focus:ring-0 outline-none transition-shadow"
            />
          </div>

          {/* Gender Selection - INLINE (Gender label + Male/Female options in one line) */}
          <div className="flex items-center space-x-4">
            <label className="text-xs font-medium text-gray-700 whitespace-nowrap">
              Gender *
            </label>
            <div className="flex space-x-2 flex-1">
              <label className="flex-1">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === "Male"}
                  onChange={handleChange}
                  className="hidden"
                  id="gender-male"
                />
                <div className={`w-full py-2 text-center rounded-lg border cursor-pointer transition-all text-xs ${
                  formData.gender === "Male" 
                    ? "border-amber-500 bg-amber-50 text-amber-700" 
                    : "border-gray-300 hover:border-amber-300 text-gray-700"
                }`}>
                  <span className="font-medium">Male</span>
                </div>
              </label>
              <label className="flex-1">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === "Female"}
                  onChange={handleChange}
                  className="hidden"
                  id="gender-female"
                />
                <div className={`w-full py-2 text-center rounded-lg border cursor-pointer transition-all text-xs ${
                  formData.gender === "Female" 
                    ? "border-amber-500 bg-amber-50 text-amber-700" 
                    : "border-gray-300 hover:border-amber-300 text-gray-700"
                }`}>
                  <span className="font-medium">Female</span>
                </div>
              </label>
            </div>
          </div>

          {/* Location Fields - Compact */}
          <div className="grid grid-cols-3 gap-2">
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full px-2 py-3 text-xs border border-amber-300 rounded-lg bg-white shadow-[0_0_8px_rgba(255,193,7,0.25)] focus:shadow-[0_0_12px_rgba(255,193,7,0.45)] focus:border-amber-400 focus:ring-0 transition-shadow"
            >
              <option value="Ethiopia">Ethiopia</option>
            </select>

            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-2 py-3 text-xs border border-amber-300 rounded-lg bg-white shadow-[0_0_8px_rgba(255,193,7,0.25)] focus:shadow-[0_0_12px_rgba(255,193,7,0.45)] focus:border-amber-400 focus:ring-0 transition-shadow"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>

            {selectedCity && (
              <select
                name="subCity"
                value={formData.subCity}
                onChange={handleChange}
                required
                className="w-full px-2 py-3 text-xs border border-amber-300 rounded-lg bg-white shadow-[0_0_8px_rgba(255,193,7,0.25)] focus:shadow-[0_0_12px_rgba(255,193,7,0.45)] focus:border-amber-400 focus:ring-0 transition-shadow"
              >
                <option value="">Select Sub-City</option>
                {selectedCity.sub_cities.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Passport/ID Image Upload - Compact */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Passport / National ID Photo *
            </label>
            
            <div className="border border-dashed border-amber-300 rounded-lg p-3 shadow-[0_0_8px_rgba(255,193,7,0.20)] focus-within:shadow-[0_0_12px_rgba(255,193,7,0.40)] hover:border-amber-400 transition-all">
              {previewImage ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img 
                      src={previewImage} 
                      alt="ID preview" 
                      className="w-16 h-12 object-cover rounded border border-gray-300"
                    />
                    <span className="text-xs text-gray-600">Image uploaded</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        const fileInput = document.getElementById('passportImage') as HTMLInputElement;
                        fileInput?.click();
                      }}
                      className="px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition-colors"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPassportImage(null);
                        setPreviewImage("");
                        const fileInput = document.getElementById('passportImage') as HTMLInputElement;
                        if (fileInput) fileInput.value = '';
                      }}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="passportImage"
                  className="cursor-pointer flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-amber-100 rounded flex items-center justify-center">
                    <FiCamera className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-700">
                      Click to upload ID photo
                    </span>
                    <p className="text-xs text-gray-500">
                      Passport, National ID, or Local Government ID
                    </p>
                  </div>
                </label>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="passportImage"
              />
            </div>
          </div>

          {/* Submit Button - Compact */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${
              isLoading ? "bg-amber-300 cursor-not-allowed" : "bg-amber-400 hover:bg-amber-500"
            } text-white font-semibold py-2.5 rounded-lg transition duration-200 text-xs mt-2 flex items-center justify-center`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                Registering...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full text-xs text-amber-500 hover:text-amber-600 text-center mt-2 transition"
        >
          Already have an account? <span className="underline">Return to login</span>
        </button>

        {/* Footer - Compact */}
        <div className="mt-3 pt-2 border-t border-amber-100 text-center">
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
