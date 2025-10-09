import React, { useState, useEffect } from "react";
import { X, Check, Upload } from "lucide-react";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: "manager" | "operator" | "finance" | string; // Made more flexible
  user: any;
  onSave: (updatedUser: FormData) => Promise<void>;
  title?: string; // Optional custom title
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
    passwordHash: "",
    imageUrl: "",
    region: "",
    city: "",
    subCity: "",
    latitude: "",
    longitude: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        email: user.email || "",
        mobilePhone: user.mobilePhone || "",
        userName: user.userName || "",
        passwordHash: "",
        imageUrl: user.imageUrl || "",
        region: user.region || "",
        city: user.city || "",
        subCity: user.subCity || "",
        latitude: user.latitude || "",
        longitude: user.longitude || "",
      });
      if (user.imageUrl) setImagePreview(user.imageUrl);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      
      // Append form fields
      Object.entries(form).forEach(([key, value]) => {
        if (value !== "") formData.append(key, value);
      });
      
      // Append image if changed
      if (imageFile) {
        formData.append("ImageFile", imageFile);
      }

      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Save failed");
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
            {/* Compact Image Upload */}
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-amber-500" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="cursor-pointer text-sm">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="text-amber-700 hover:text-amber-800 text-sm font-medium">
                    {imagePreview ? "Change image" : "Upload image"}
                  </div>
                </label>
              </div>
            </div>

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

            {/* Password Field */}
            <div>
              <label className="block text-xs font-medium text-amber-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                name="passwordHash"
                value={form.passwordHash}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
                className="w-full border border-amber-200 rounded-lg p-2 text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
              />
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