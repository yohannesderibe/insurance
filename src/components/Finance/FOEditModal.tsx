import React, { useState } from "react";
import { updateSubCategoryByFO } from "../../api/Finance/financeOfficerApi";
import { X } from "lucide-react";

interface Props {
  type: "subcategory";
  id: string;
  data: { name: string; description?: string; pricePerYear?: number };
  onClose: () => void;
  onSaved: () => void;
}

const FOEditModal: React.FC<Props> = ({ id, data, onClose, onSaved }) => {
  const [pricePerYear, setPricePerYear] = useState(data.pricePerYear || 0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSubCategoryByFO(id, { pricePerYear });
      onSaved();
    } catch (error) {
      console.error("Failed to update:", error);
      alert("Failed to update. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md border border-amber-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-amber-900">
            Edit Subcategory Price
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-amber-100 rounded">
            <X className="w-5 h-5 text-amber-700" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-amber-700 mb-2">
            <strong>Name:</strong> {data.name}
          </p>
          <p className="text-sm text-amber-700 mb-4">
            <strong>Description:</strong> {data.description || "N/A"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-amber-700 mb-1">
              Base Price (per year) *
            </label>
            <input
              type="number"
              value={pricePerYear}
              onChange={(e) => setPricePerYear(Number(e.target.value))}
              required
              min="0"
              step="0.01"
              className="w-full border border-amber-200 rounded-lg p-2 text-sm focus:ring-1 focus:ring-amber-500"
            />
            <p className="text-xs text-amber-600 mt-1">
              Finance Officer can only modify pricing fields
            </p>
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
              className="px-4 py-2 text-sm rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FOEditModal;

