import React, { useEffect, useState, useRef } from "react";
import { addCategory, updateCategory, getCategoryById } from "../../../../api/Admin/categoriesApi";
import type { CategoryDto } from "../../../../api/Admin/categoriesApi";
import { X, Check, Upload, Info } from "lucide-react";

interface Props {
  id: string | null;
  onClose: () => void;
  onSaved?: () => void;
}

const CategoryForm: React.FC<Props> = ({ id, onClose, onSaved }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fullInsurancePercentage, setFullInsurancePercentage] = useState<number | null>(null);
  const [thirdPartyPercentage, setThirdPartyPercentage] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) {
      // Reset form for new category
      setName("");
      setDescription("");
      setFullInsurancePercentage(null);
      setThirdPartyPercentage(null);
      setIsActive(true);
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    // Load existing category data
    (async () => {
      try {
        const cat: CategoryDto = await getCategoryById(id);
        setName(cat.name);
        setDescription(cat.description || "");
        setFullInsurancePercentage(cat.fullInsurancePercentage);
        setThirdPartyPercentage(cat.thirdPartyPercentage);
        setIsActive(cat.isActive);
        
        if (cat.imageUrl) {
          setImagePreview(cat.imageUrl);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load category data");
      }
    })();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      
      // Check file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        alert("Only image files (JPEG, JPG, PNG, GIF) are allowed");
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert("Name is required");
      return;
    }
    
    // Validate percentages if provided
    if (fullInsurancePercentage !== null && (fullInsurancePercentage < 0 || fullInsurancePercentage > 100)) {
      alert("Full Insurance Percentage must be between 0 and 100");
      return;
    }
    
    if (thirdPartyPercentage !== null && (thirdPartyPercentage < 0 || thirdPartyPercentage > 100)) {
      alert("Third Party Percentage must be between 0 and 100");
      return;
    }
    
    setLoading(true);
    try {
      const form = new FormData();
      form.append("Name", name.trim());
      form.append("Description", description.trim());
      
      // Only append percentages if they have values
      if (fullInsurancePercentage !== null) {
        form.append("FullInsurancePercentage", fullInsurancePercentage.toString());
      }
      
      if (thirdPartyPercentage !== null) {
        form.append("ThirdPartyPercentage", thirdPartyPercentage.toString());
      }
      
      form.append("IsActive", String(isActive));
      form.append("CreatedAt", new Date().toISOString());
      
      // Append image file if exists
      if (imageFile) {
        form.append("ImageFile", imageFile);
      }
      
      if (id) {
        await updateCategory(id, form);
        alert("Category updated successfully!");
      } else {
        await addCategory(form);
        alert("Category created successfully!");
      }
      
      onSaved?.();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Save failed. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to handle percentage input changes
  const handlePercentageChange = (value: string, setter: React.Dispatch<React.SetStateAction<number | null>>) => {
    if (value === "") {
      setter(null);
    } else {
      const numValue = parseFloat(value);
      setter(isNaN(numValue) ? null : numValue);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl border border-amber-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-amber-900">
          {id ? "Edit Category" : "New Category"}
        </h2>
        <button 
          onClick={onClose} 
          className="p-1 hover:bg-amber-100 rounded"
          disabled={loading}
        >
          <X className="w-5 h-5 text-amber-700" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-amber-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                placeholder="Enter category name"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full border border-amber-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                placeholder="Enter category description"
                disabled={loading}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-600 text-sm">
                <Info className="w-4 h-4" />
                <span>Insurance Percentages (Optional)</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-700 mb-1">
                    Full Insurance %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={fullInsurancePercentage === null ? "" : fullInsurancePercentage}
                    onChange={(e) => handlePercentageChange(e.target.value, setFullInsurancePercentage)}
                    className="w-full border border-amber-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                    placeholder="Leave empty for none"
                    disabled={loading}
                  />
                  <p className="text-xs text-amber-500 mt-1">
                    Percentage for full insurance (0-100)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-700 mb-1">
                    Third Party %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={thirdPartyPercentage === null ? "" : thirdPartyPercentage}
                    onChange={(e) => handlePercentageChange(e.target.value, setThirdPartyPercentage)}
                    className="w-full border border-amber-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                    placeholder="Leave empty for none"
                    disabled={loading}
                  />
                  <p className="text-xs text-amber-500 mt-1">
                    Percentage for third party (0-100)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image Upload */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">
                Category Image (Optional)
              </label>
              
              {/* Image Preview Area */}
              <div className="mb-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-xl border border-amber-200"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      disabled={loading}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-amber-200 rounded-xl p-8 text-center hover:border-amber-400 transition-colors">
                    <Upload className="w-12 h-12 text-amber-300 mx-auto mb-3" />
                    <p className="text-amber-600 mb-2">Upload category image</p>
                    <p className="text-amber-400 text-sm">Optional - JPEG, JPG, PNG, GIF (max 5MB)</p>
                  </div>
                )}
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
                id="categoryImageUpload"
                disabled={loading}
              />

              {/* Upload button */}
              <label
                htmlFor="categoryImageUpload"
                className={`block w-full text-center py-2 px-4 rounded-xl cursor-pointer transition-all ${
                  loading 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                }`}
              >
                {imagePreview ? "Change Image" : "Select Image"}
              </label>
            </div>

            {/* Status Toggle */}
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-amber-800">Status</p>
                <p className="text-xs text-amber-600">
                  {isActive ? "Category will be visible" : "Category will be hidden"}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="sr-only"
                  disabled={loading}
                />
                <div
                  className={`w-12 h-6 rounded-full transition-colors ${
                    isActive ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full transform transition-transform ${
                      isActive ? "translate-x-7" : "translate-x-0.5"
                    } mt-0.5`}
                  />
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-amber-200">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl border border-amber-300 text-amber-700 hover:bg-amber-50 transition-all duration-200 font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-medium hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : id ? (
              <>
                <Check className="w-4 h-4" />
                Update Category
              </>
            ) : (
              "Create Category"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;