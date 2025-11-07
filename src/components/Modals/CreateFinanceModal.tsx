import React, { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

const CreateFinanceModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    grandFatherName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    region: "",
    city: "",
    subcity: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.phone) newErrors.phone = "Phone is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (onSubmit) {
      const { confirmPassword, ...submitData } = formData;
      onSubmit(submitData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-amber-200">
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Create Finance Officer</h2>
          <button onClick={onClose} className="text-white text-xl hover:text-amber-200 transition-colors">
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            {/* Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-amber-800 font-medium mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.name ? "border-red-500" : "border-amber-200"
                  } rounded-xl p-2 focus:ring-2 focus:ring-amber-400 outline-none transition-colors`}
                  placeholder="Enter name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
                />
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
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-amber-800 font-medium mb-1">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.phone ? "border-red-500" : "border-amber-200"
                  } rounded-xl p-2 focus:ring-2 focus:ring-amber-400 outline-none transition-colors`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
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
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Address Row */}
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
                />
              </div>
              <div>
                <label className="block text-amber-800 font-medium mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border border-amber-200 rounded-xl p-2 focus:ring-2 focus:ring-amber-400 outline-none transition-colors"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="block text-amber-800 font-medium mb-1">Subcity</label>
                <input
                  type="text"
                  name="subcity"
                  value={formData.subcity}
                  onChange={handleChange}
                  className="w-full border border-amber-200 rounded-xl p-2 focus:ring-2 focus:ring-amber-400 outline-none transition-colors"
                  placeholder="Enter subcity"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-amber-100">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-amber-300 text-amber-700 hover:bg-amber-50 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-medium hover:from-amber-700 hover:to-amber-800"
            >
              Create Finance Officer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFinanceModal;