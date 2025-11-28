import React, { useState, useEffect } from "react";
import { getApprovedSubCategories } from "../../api/Finance/financeOfficerApi";
import type { SubCategoryDto } from "../../api/Admin/Catagories/subCategoriesApi";
import { CheckCircle, DollarSign, Search, Calendar, User } from "lucide-react";
import { TableRow, TableCell } from "@mui/material";
import ReusableTable from "../Tables/ReusableTable";
import SearchBar from "../../reusable/UI/SearchBar";

const ApprovedItemsView: React.FC = () => {
  const [subCategories, setSubCategories] = useState<SubCategoryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const subCats = await getApprovedSubCategories();
      setSubCategories(subCats);
    } catch (error) {
      console.error("Failed to fetch approved items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredSubCategories = subCategories.filter(s =>
    `${s.name} ${s.description}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayItems = filteredSubCategories.map(s => ({ type: "subcategory" as const, ...s }));

  const columns = [
    { label: "Name", key: "name" },
    { label: "Price", key: "pricePerYear", align: "right" as const },
    { label: "Approved By", key: "approvedBy" },
    { label: "Approved At", key: "approvedAt" },
    { label: "Status", key: "status", align: "center" as const },
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-green-200">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
            <SearchBar
              placeholder="Search approved subcategories..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-green-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <>
            <ReusableTable
              columns={columns}
              data={displayItems}
              renderRow={(row: SubCategoryDto & { type: string }) => (
                <TableRow key={row.id} className="hover:bg-green-50">
                  <TableCell className="py-3 px-4 font-medium text-green-900">{row.name}</TableCell>
                  <TableCell className="py-3 px-4 text-green-700" align="right">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {row.pricePerYear?.toFixed(2) || "0.00"}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-green-700">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {row.approvedBy || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-green-700">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {row.approvedAt ? new Date(row.approvedAt).toLocaleDateString() : "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-center">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Approved
                    </span>
                  </TableCell>
                </TableRow>
              )}
            />
            {displayItems.length === 0 && (
              <div className="text-center py-12">
                <div className="text-green-400 text-6xl mb-4">✓</div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">No Approved Items</h3>
                <p className="text-green-600">Approved items will appear here</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ApprovedItemsView;

