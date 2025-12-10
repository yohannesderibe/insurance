import React, { useState, useRef,useEffect  } from "react";
import citiesData from '../../data/cities.json';
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: FormData) => Promise<void>;
}


const CreateClientModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    fatherName: "",
    grandFatherName: "",
    dateOfBirth: "",
    gender: "Male",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    region: "",
    city: "",
    subCity: "",
    nationalIdOrPassport: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

     const [cities, setCities] = useState<string[]>([]);
  const [subCities, setSubCities] = useState<string[]>([]);

  // Extract cities on component mount
  useEffect(() => {
    const cityNames = citiesData.cities.map(city => city.name);
    setCities(cityNames);
  }, []);

  // Update subcities when city changes
  useEffect(() => {
    if (formData.city) {
      const selectedCity = citiesData.cities.find(city => city.name === formData.city);
      setSubCities(selectedCity ? selectedCity.sub_cities : []);
      // Reset subCity when city changes
      setFormData(prev => ({ ...prev, subCity: "" }));
    } else {
      setSubCities([]);
    }
  }, [formData.city]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!formData.nationalIdOrPassport.trim()) newErrors.nationalIdOrPassport = "National ID or Passport is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      
      // Check file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        alert("Only JPEG, JPG, and PNG files are allowed");
        return;
      }
      
      setImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Create FormData object
      const submitFormData = new FormData();
      
      // Append all fields from formData
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'confirmPassword') { // Don't send confirmPassword
          submitFormData.append(key, value);
        }
      });
      
      // Add current timestamp for CreatedAt
      submitFormData.append("createdAt", new Date().toISOString());
      
      // Append image file if exists
      if (imageFile) {
        submitFormData.append("imageFile", imageFile);
      }
      
      if (onSubmit) {
        await onSubmit(submitFormData);
      }
      
      // Reset form
      setFormData({
        firstName: "",
        fatherName: "",
        grandFatherName: "",
        dateOfBirth: "",
        gender: "Male",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        region: "",
        city: "",
        subCity: "",
        nationalIdOrPassport: "",
      });
      setImageFile(null);
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Error creating customer:", error);
      alert("Failed to create customer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-amber-200">
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Create Customer</h2>
          <button 
            onClick={onClose} 
            className="text-white text-xl hover:text-amber-200 transition-colors"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            {/* Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-amber-800 font-medium mb-1">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.firstName ? "border-red-500" : "border-amber-200"
                  } rounded-xl p-2 focus:ring-2 focus:ring-amber-400 outline-none transition-colors`}
                  placeholder="Enter first name"
                  disabled={loading}
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-amber-800 font-medium mb-1">Father Name</label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className="w-full border border-amber-200 rounded-xl p-2 focus:ring-2 focus:ring-amber-400 outline-none transition-colors"
                  placeholder="Enter father's name"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-amber-800 font-medium mb-1">Grandfather Name</label>
                <input
                  type="text"
                  name="grandFatherName"
                  value={formData.grandFatherName}
                  onChange={handleChange}
                  className="w-full border border-amber-200 rounded-xl p-2 focus:ring-2 focus:ring-amber-400 outline-none transition-colors"
                  placeholder="Enter grandfather's name"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Date of Birth and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-amber-800 font-medium mb-1">Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.dateOfBirth ? "border-red-500" : "border-amber-200"
                  } rounded-xl p-2 focus:ring-2 focus:ring-amber-400 outline-none transition-colors`}
                  max={new Date().toISOString().split('T')[0]}
                  disabled={loading}
                />
                {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
              </div>
              <div>
                <label className="block text-amber-800 font-medium mb-1">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border border-amber-200 rounded-xl p-2 focus:ring-2 focus:ring-amber-400 outline-none transition-colors bg-white"
                  disabled={loading}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            {/* Email and Phone Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-amber-800 font-medium mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.email ? "border-red-500" : "border-amber-200"
                  } rounded-xl p-2 focus:ring-2 focus:ring-amber-400 outline-none transition-colors`}
                  placeholder="Enter email address"
                  disabled={loading}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-amber-800 font-medium mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.phoneNumber ? "border-red-500" : "border-amber-200"
                  } rounded-xl p-2 focus:ring-2 focus:ring-amber-400 outline-none transition-colors`}
                  placeholder="Enter phone number"
                  disabled={loading}
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
              </div>
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-amber-800 font-medium mb-1">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.password ? "border-red-500" : "border-amber-200"
                  } rounded-xl p-2 focus:ring-2 focus:ring-amber-400 outline-none transition-colors`}
                  placeholder="Enter password"
                  disabled={loading}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-amber-800 font-medium mb-1">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.confirmPassword ? "border-red-500" : "border-amber-200"
                  } rounded-xl p-2 focus:ring-2 focus:ring-amber-400 outline-none transition-colors`}
                  placeholder="Confirm password"
                  disabled={loading}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* National ID and Image Upload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-amber-800 font-medium mb-1">National ID/Passport *</label>
                <input
                  type="text"
                  name="nationalIdOrPassport"
                  value={formData.nationalIdOrPassport}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.nationalIdOrPassport ? "border-red-500" : "border-amber-200"
                  } rounded-xl p-2 focus:ring-2 focus:ring-amber-400 outline-none transition-colors`}
                  placeholder="Enter national ID or passport number"
                  disabled={loading}
                />
                {errors.nationalIdOrPassport && (
                  <p className="text-red-500 text-sm mt-1">{errors.nationalIdOrPassport}</p>
                )}
              </div>
              <div>
                <label className="block text-amber-800 font-medium mb-1">Profile Image</label>
                <div className="border border-amber-200 rounded-xl p-2">
                  {imageFile ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 truncate">{imageFile.name}</span>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="text-red-500 hover:text-red-700 text-sm"
                        disabled={loading}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/jpeg,image/jpg,image/png"
                        className="hidden"
                        id="clientImageUpload"
                        disabled={loading}
                      />
                      <label
                        htmlFor="clientImageUpload"
                        className="cursor-pointer text-amber-600 hover:text-amber-800 text-sm"
                      >
                        Click to upload image (JPEG, JPG, PNG, max 5MB)
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

        {/* Address Row - UPDATED TO USE DROPDOWNS */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div>
    <label className="block text-amber-800 font-medium mb-1">Region</label>
    <input
      type="text"
      name="region"
      value={formData.region}
      onChange={handleChange}
      className="w-full border border-amber-200 rounded-xl p-2 focus:ring-2 focus:ring-amber-400 outline-none transition-colors"
      placeholder="Enter region"
      disabled={loading}
    />
  </div>
  
  {/* City Dropdown */}
  <div>
    <label className="block text-amber-800 font-medium mb-1">City *</label>
    <select
      name="city"
      value={formData.city}
      onChange={handleChange}
      className={`w-full border ${
        errors.city ? "border-red-500" : "border-amber-200"
      } rounded-xl p-2 focus:ring-2 focus:ring-amber-400 outline-none transition-colors bg-white`}
      disabled={loading}
    >
      <option value="">Select a city</option>
      {cities.map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
    </select>
    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
  </div>
  
  {/* Subcity Dropdown - Only enabled when city is selected */}
  <div>
    <label className="block text-amber-800 font-medium mb-1">Subcity</label>
    <select
      name="subCity"
      value={formData.subCity}
      onChange={handleChange}
      className="w-full border border-amber-200 rounded-xl p-2 focus:ring-2 focus:ring-amber-400 outline-none transition-colors bg-white"
      disabled={loading || !formData.city}
    >
      <option value="">
        {formData.city ? "Select a subcity" : "Select a city first"}
      </option>
      {subCities.map((subCity) => (
        <option key={subCity} value={subCity}>
          {subCity}
        </option>
      ))}
    </select>
  </div>
</div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-amber-100">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl border border-amber-300 text-amber-700 hover:bg-amber-50 transition-all duration-200 font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-medium hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Customer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateClientModal;