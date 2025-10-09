import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: "manager" | "operator" | "finance" | string;
  user: any;
  onSave: (updatedUser: any) => Promise<void>;
  title?: string;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ 
  isOpen, 
  onClose, 
  role, 
  user, 
  onSave,
  title 
}) => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobilePhone: "",
    userName: "",
    password: "", // User-facing password field (leave empty for no change)
    imageUrl: "",
    region: "",
    city: "",
    subCity: "",
    latitude: "",
    longitude: "",
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        email: user.email || "",
        mobilePhone: user.mobilePhone || "",
        userName: user.userName || "",
        password: "", // Always start with empty password field
        imageUrl: user.imageUrl || "",
        region: user.region || "",
        city: user.city || "",
        subCity: user.subCity || "",
        latitude: user.latitude || "",
        longitude: user.longitude || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Get the existing password hash from the user object
      // If the user entered a new password, use that. Otherwise, use the existing hash.
      const passwordToSend = form.password 
        ? form.password  // New password entered
        : user?.passwordHash || "existing-password-hash"; // Use existing hash or fallback

      const requestData = {
        FullName: form.fullName,
        Email: form.email,
        MobilePhone: form.mobilePhone,
        UserName: form.userName,
        PasswordHash: passwordToSend, // Always send password (either new or existing)
        ImageUrl: form.imageUrl || user?.imageUrl || "",
        Region: form.region || user?.region || "",
        City: form.city || user?.city || "",
        SubCity: form.subCity || user?.subCity || "",
        Latitude: form.latitude || user?.latitude || "",
        Longitude: form.longitude || user?.longitude || "",
      };

      console.log("Sending user data:", {
        ...requestData,
        PasswordHash: form.password ? "NEW_PASSWORD" : "EXISTING_HASH" // Hide actual hash in logs
      });

      await onSave(requestData);
      onClose();
    } catch (err) {
      console.error("Save error:", err);
      alert("Save failed: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const displayTitle = title || `Edit ${role.charAt(0).toUpperCase() + role.slice(1)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md border border-amber-200">
        {/* Compact Header */}
        <div className="flex items-center justify-between p-4 border-b border-amber-200">
          <h2 className="text-lg font-semibold text-amber-900">
            {displayTitle}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-amber-100 rounded transition-colors text-amber-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Compact Form Content */}
        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info - Compact Grid */}
            <div className="grid grid-cols-2 gap-3">
              {["fullName", "email", "mobilePhone", "userName"].map((field) => (
                <div key={field} className={field === "email" ? "col-span-2" : ""}>
                  <label className="block text-xs font-medium text-amber-700 mb-1 capitalize">
                    {field === "fullName" ? "Full Name" : 
                     field === "mobilePhone" ? "Mobile Phone" :
                     field === "userName" ? "Username" : field}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={(form as any)[field]}
                    onChange={handleChange}
                    className="w-full border border-amber-200 rounded-lg p-2 text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              ))}
            </div>

            {/* Password Field - Optional for changes */}
            <div>
              <label className="block text-xs font-medium text-amber-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
                className="w-full border border-amber-200 rounded-lg p-2 text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
              />
              <p className="text-xs text-amber-600 mt-1">
                {form.password 
                  ? "Password will be updated" 
                  : "Current password will be preserved"
                }
              </p>
            </div>

            {/* Location Fields - Only for operators */}
            {role === "operator" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {["region", "city"].map((field) => (
                    <div key={field}>
                      <label className="block text-xs font-medium text-amber-700 mb-1 capitalize">
                        {field}
                      </label>
                      <input
                        type="text"
                        name={field}
                        value={(form as any)[field]}
                        onChange={handleChange}
                        className="w-full border border-amber-200 rounded-lg p-2 text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  ))}
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-amber-700 mb-1">
                    Sub City
                  </label>
                  <input
                    type="text"
                    name="subCity"
                    value={form.subCity}
                    onChange={handleChange}
                    className="w-full border border-amber-200 rounded-lg p-2 text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {["latitude", "longitude"].map((field) => (
                    <div key={field}>
                      <label className="block text-xs font-medium text-amber-700 mb-1 capitalize">
                        {field}
                      </label>
                      <input
                        type="text"
                        name={field}
                        value={(form as any)[field]}
                        onChange={handleChange}
                        className="w-full border border-amber-200 rounded-lg p-2 text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compact Action Buttons */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-sm rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 disabled:opacity-50 transition-colors flex items-center gap-1"
              >
                {loading ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-3 h-3" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;