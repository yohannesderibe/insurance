import React, { useEffect, useState } from "react";
import { addCategory, updateCategory, getCategoryById } from "../../../../api/Admin/categoriesApi";
import type { CategoryDto } from "../../../../api/Admin/categoriesApi";
import { X, Check } from "lucide-react";

interface Props {
  id: string | null;
  onClose: () => void;
  onSaved?: () => void;
}

const CategoryForm: React.FC<Props> = ({ id, onClose, onSaved }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const cat: CategoryDto = await getCategoryById(id);
        setName(cat.name);
        setDescription(cat.description);
        setIsActive(cat.isActive);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();
      form.append("Name", name);
      form.append("Description", description);
      form.append("IsActive", String(isActive));
      form.append("CreatedAt", new Date().toISOString());

      if (id) await updateCategory(id, form);
      else await addCategory(form);

      onSaved?.();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg w-full max-w-md border border-amber-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-amber-900">
          {id ? "Edit Category" : "New Category"}
        </h2>
        <button onClick={onClose} className="p-1 hover:bg-amber-100 rounded">
          <X className="w-5 h-5 text-amber-700" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-amber-700 mb-1">Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-amber-200 rounded-lg p-2 text-sm focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-amber-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full border border-amber-200 rounded-lg p-2 text-sm focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center justify-between p-2 bg-amber-50 rounded-lg">
          <span className="text-sm font-medium text-amber-800">Active</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-8 h-4 rounded-full transition-colors ${
                isActive ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-3 h-3 rounded-full transform transition-transform ${
                  isActive ? "translate-x-4" : "translate-x-0.5"
                } mt-0.5`}
              />
            </div>
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-sm rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 disabled:opacity-50 flex items-center gap-1"
          >
            {loading ? "Saving..." : id ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
