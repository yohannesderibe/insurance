// src/pages/Admin/Category/CategoryPage.tsx
import React, { useState } from "react";
import Sidebar from "../../../../components/Bars/SideBars/Admin";
import CategoryList from "./CategoryList";
import CategoryForm from "./CategoryForm";

const CategoryPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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
    <div className="flex min-h-screen bg-gradient-to-br from-amber-50/50 to-yellow-50/50">
      {/* Sidebar placeholder (keeps same layout as your other pages) */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile header — same pattern as IRS code you showed */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-20 p-4 border-b border-amber-200">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-amber-100 text-amber-700"
          >
            ☰
          </button>
          <h1 className="text-lg font-bold text-amber-900">Categories</h1>
          <div className="w-8" />
        </div>
      </div>

      {/* Main content (space reserved for md:ml-64) */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0">
        <div className="p-6">
          <CategoryList
            onEdit={openEdit}
            onCreate={openCreate}
            refreshKey={refreshKey}
          />
        </div>

        {/* Modal / drawer for add/edit */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-3xl p-6">
              <CategoryForm id={editingId} onClose={() => setShowForm(false)} onSaved={onSaved} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;
