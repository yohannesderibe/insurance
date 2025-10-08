// src/pages/Admin/Category/CategoryForm.tsx
import React, { useEffect, useState } from "react";
import { addCategory, updateCategory, getCategoryById } from "../../../../api/Admin/categoriesApi";
import type { CategoryDto } from "../../../../api/Admin/categoriesApi";
import { Upload, X, Check } from "lucide-react";

interface Props {
  id: string | null;
  onClose: () => void;
  onSaved?: () => void;
}

const CategoryForm: React.FC<Props> = ({ id, onClose, onSaved }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerYear, setPricePerYear] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const cat: CategoryDto = await getCategoryById(id);
        setName(cat.name);
        setDescription(cat.description);
        setPricePerYear(cat.pricePerYear);
        setIsActive(cat.isActive);
        if (cat.imageUrl) setImagePreview(cat.imageUrl);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

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
      const form = new FormData();
      form.append("Name", name);
      form.append("Description", description);
      form.append("PricePerYear", String(pricePerYear));
      if (imageFile) form.append("ImageFile", imageFile);
      form.append("IsActive", String(isActive));
      form.append("CreatedAt", new Date().toISOString());

      if (id) {
        await updateCategory(id, form);
      } else {
        await addCategory(form);
      }

      onSaved?.();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md border border-amber-200">
        {/* Compact Header */}
        <div className="flex items-center justify-between p-4 border-b border-amber-200">
          <h2 className="text-lg font-semibold text-amber-900">
            {id ? "Edit Category" : "New Category"}
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

            {/* Name and Price in compact row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-amber-700 mb-1">
                  Name *
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-amber-200 rounded-lg p-2 text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-amber-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={pricePerYear}
                  onChange={(e) => setPricePerYear(Number(e.target.value))}
                  min="0"
                  step="0.01"
                  className="w-full border border-amber-200 rounded-lg p-2 text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            {/* Compact Status Toggle */}
            <div className="flex items-center justify-between p-2 bg-amber-50 rounded-lg">
              <span className="text-sm font-medium text-amber-800">Active</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-8 h-4 rounded-full transition-colors ${
                  isActive ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <div className={`bg-white w-3 h-3 rounded-full transform transition-transform ${
                    isActive ? 'translate-x-4' : 'translate-x-0.5'
                  } mt-0.5`} />
                </div>
              </label>
            </div>

            {/* Compact Description */}
            <div>
              <label className="block text-xs font-medium text-amber-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full border border-amber-200 rounded-lg p-2 text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 resize-none"
              />
            </div>

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
                    {id ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Check className="w-3 h-3" />
                    {id ? "Update" : "Create"}
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

export default CategoryForm;