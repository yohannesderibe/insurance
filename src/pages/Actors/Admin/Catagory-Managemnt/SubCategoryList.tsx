import React, { useEffect, useState } from "react";
import ReusableTable from "../../../../components/Tables/ReusableTable";
import { TableRow, TableCell } from "@mui/material";
import { getSubCategories, deleteSubCategory } from "../../../../api/Admin/Catagories/subCategoriesApi";
 import type { SubCategoryDto } from "../../../../api/Admin/Catagories/subCategoriesApi";
import { FiEdit2, FiTrash, FiEye } from "react-icons/fi";
import { FolderTree, Search, Filter } from "lucide-react";
import AddButton from "../../../../reusable/UI/AddButton";
import SearchBar from "../../../../reusable/UI/SearchBar";
import Pagination from "../../../../reusable/UI/Pagination";

interface Props {
  onEdit: (id: string) => void;
  onCreate: () => void;
  onView: (id: string) => void;
  refreshKey?: number;
}

const SubCategoryList: React.FC<Props> = ({ onEdit, onCreate, onView, refreshKey = 0 }) => {
  const [subCategories, setSubCategories] = useState<SubCategoryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const fetchSubCategories = async () => {
    setLoading(true);
    try {
      const data = await getSubCategories();
      setSubCategories(data);
    } catch (err) {
      console.error("Failed to load subcategories", err);
      setSubCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, [refreshKey]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this subcategory?")) return;
    try {
      await deleteSubCategory(id, false);
      setSubCategories((prev) => prev.filter((s) => s.id !== id));
      alert("Subcategory deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete subcategory.");
    }
  };

  const filtered = subCategories.filter((s) =>
    `${s.name} ${s.description} ${s.categoryName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const startIndex = (currentPage - 1) * perPage;
  const pageItems = filtered.slice(startIndex, startIndex + perPage);

  const columns = [
    { label: "Subcategory Name", key: "name" },
    { label: "Description", key: "description" },
    { label: "Parent Category", key: "categoryName" },
    { label: "Status", key: "isActive", align: "center" },
    { label: "Created", key: "createdAt" },
    { label: "Actions", key: "actions", align: "center" },
  ];

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
            Subcategory Management
          </h2>
          <p className="text-amber-800 mt-2">Manage subcategories under each category</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-amber-200">
            <FolderTree className="w-5 h-5 text-amber-600" />
            <span className="text-amber-700 font-medium">Subcategories</span>
          </div>
          <AddButton label="Add Subcategory" onClick={onCreate} />
        </div>
      </div>

      {/* Search / Filter */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
            <SearchBar
              placeholder="Search subcategory by name, description, or category..."
              value={searchTerm}
              onChange={(v) => {
                setSearchTerm(v);
                setCurrentPage(1);
              }}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-amber-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <>
            <ReusableTable
              columns={columns}
              data={pageItems}
              renderRow={(row: SubCategoryDto) => (
                <TableRow key={row.id} className="hover:bg-amber-50">
                  <TableCell className="py-3 px-4 font-medium text-amber-900">{row.name}</TableCell>
                  <TableCell className="py-3 px-4 text-amber-800">{row.description}</TableCell>
                  <TableCell className="py-3 px-4 text-amber-800">{row.categoryName}</TableCell>
                  <TableCell className="py-3 px-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        row.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {row.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-amber-700">
                    {new Date(row.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="p-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700 transition-colors"
                        onClick={() => onEdit(row.id)}
                        title="Edit subcategory"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>

                      <button
                        className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
                        onClick={() => onView(row.id)}
                        title="View details"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>

                      <button
                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                        onClick={() => handleDelete(row.id)}
                        title="Delete subcategory"
                      >
                        <FiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-amber-200">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="text-amber-400 text-6xl mb-4">📂</div>
            <h3 className="text-lg font-semibold text-amber-800 mb-2">No subcategories found</h3>
            <p className="text-amber-600">
              {searchTerm
                ? "Try adjusting your search terms"
                : "No subcategories have been added yet"}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default SubCategoryList;
