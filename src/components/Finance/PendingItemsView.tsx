import React, { useState, useEffect } from "react";
import { 
  getPendingSubCategories,
  approveSubCategory,
  rejectSubCategory
} from "../../api/Finance/financeOfficerApi";
import type { SubCategoryDto } from "../../api/Admin/Catagories/subCategoriesApi";
import { CheckCircle, XCircle, Edit, Search, DollarSign } from "lucide-react";
import FOEditModal from "./FOEditModal";
import { TableRow, TableCell } from "@mui/material";
import ReusableTable from "../Tables/ReusableTable";
import SearchBar from "../../reusable/UI/SearchBar";

interface Props {
  onRefresh?: () => void;
}

const PendingItemsView: React.FC<Props> = ({ onRefresh }) => {
  const [subCategories, setSubCategories] = useState<SubCategoryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<{ type: "subcategory"; id: string; data: SubCategoryDto } | null>(null);
  const [rejectModal, setRejectModal] = useState<{ type: "subcategory"; id: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const subCats = await getPendingSubCategories();
      setSubCategories(subCats);
    } catch (error) {
      console.error("Failed to fetch pending items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    if (!window.confirm("Are you sure you want to approve this subcategory?")) return;
    
    try {
      await approveSubCategory(id);
      await fetchData();
      onRefresh?.();
      alert("Subcategory approved successfully!");
    } catch (error) {
      console.error("Failed to approve subcategory:", error);
      alert("Failed to approve subcategory. Please try again.");
    }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    if (!rejectReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    try {
      await rejectSubCategory(rejectModal.id, rejectReason);
      await fetchData();
      onRefresh?.();
      setRejectModal(null);
      setRejectReason("");
      alert("Subcategory rejected successfully!");
    } catch (error) {
      console.error("Failed to reject subcategory:", error);
      alert("Failed to reject subcategory. Please try again.");
    }
  };

  const handleEdit = (id: string) => {
    const item = subCategories.find(s => s.id === id);
    if (item) {
      setEditingItem({ type: "subcategory", id, data: item });
    }
  };

  const filteredSubCategories = subCategories.filter(s =>
    `${s.name} ${s.description}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayItems = filteredSubCategories.map(s => ({ type: "subcategory" as const, ...s }));

  const columns = [
    { label: "Name", key: "name" },
    { label: "Description", key: "description" },
    { label: "Price", key: "pricePerYear", align: "right" as const },
    { label: "Created", key: "createdAt" },
    { label: "Actions", key: "actions", align: "center" as const },
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-200">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
            <SearchBar
              placeholder="Search subcategories by name or description..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-amber-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <>
            <ReusableTable
              columns={columns}
              data={displayItems}
              renderRow={(row: SubCategoryDto & { type: string }) => (
                <TableRow key={row.id} className="hover:bg-amber-50">
                  <TableCell className="py-3 px-4 font-medium text-amber-900">{row.name}</TableCell>
                  <TableCell className="py-3 px-4 text-amber-800">{row.description || "N/A"}</TableCell>
                  <TableCell className="py-3 px-4 text-amber-700" align="right">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {row.pricePerYear?.toFixed(2) || "0.00"}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-amber-700">
                    {new Date(row.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(row.id)}
                        className="p-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleApprove(row.id)}
                        className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 transition-colors"
                        title="Approve"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setRejectModal({ type: "subcategory", id: row.id })}
                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            />
            {displayItems.length === 0 && (
              <div className="text-center py-12">
                <div className="text-amber-400 text-6xl mb-4">📋</div>
                <h3 className="text-lg font-semibold text-amber-800 mb-2">No Pending Items</h3>
                <p className="text-amber-600">All items have been reviewed</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <FOEditModal
          type={editingItem.type}
          id={editingItem.id}
          data={editingItem.data}
          onClose={() => setEditingItem(null)}
          onSaved={async () => {
            await fetchData();
            onRefresh?.();
            setEditingItem(null);
          }}
        />
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-amber-900 mb-4">
              Reject Subcategory
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-amber-700 mb-2">
                Rejection Reason *
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className="w-full border border-amber-200 rounded-lg p-2 text-sm focus:ring-1 focus:ring-amber-500"
                placeholder="Please provide a reason for rejection..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setRejectModal(null);
                  setRejectReason("");
                }}
                className="px-4 py-2 text-sm rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingItemsView;

