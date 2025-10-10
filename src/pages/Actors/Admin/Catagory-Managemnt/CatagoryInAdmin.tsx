import React, { useState } from "react";
import CategoryList from "./CategoryList";
import CategoryForm from "./CategoryForm";
import DetailModal from "../../../../reusable/UI/DetailModal";
import { getCategoryById } from "../../../../api/Admin/categoriesApi";

const CategoryPage: React.FC = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [detailData, setDetailData] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleView = async (id: string) => {
    try {
      const data = await getCategoryById(id);
      setDetailData(data);
      setIsDetailOpen(true);
    } catch (err) {
      console.error("Failed to fetch category details", err);
      alert("Failed to load details.");
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (id: string) => {
    setEditingId(id);
    setShowForm(true);
  };

  const onSaved = () => {
    setShowForm(false);
    setRefreshKey((k) => k + 1); // triggers list re-fetch
  };

  return (
    <div>
      <CategoryList
        onEdit={openEdit}
        onCreate={openCreate}
        onView={handleView}
        refreshKey={refreshKey}
      />

      {/* Modal / drawer for add/edit */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-3xl p-6">
            <CategoryForm id={editingId} onClose={() => setShowForm(false)} onSaved={onSaved} />
          </div>
        </div>
      )}
      
      <DetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Category Details"
        data={detailData}
      />
    </div>
  );
};

export default CategoryPage;