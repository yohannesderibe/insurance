import React, { useState, useEffect } from "react";
import { getRejectedSubCategories } from "../../api/Finance/financeOfficerApi";
import type { SubCategoryDto } from "../../api/Admin/Catagories/subCategoriesApi";
import { XCircle, DollarSign, Search, Calendar, User, MessageSquare } from "lucide-react";
import { TableRow, TableCell } from "@mui/material";
import ReusableTable from "../Tables/ReusableTable";
import SearchBar from "../../reusable/UI/SearchBar";

interface Props {
  onRefresh?: () => void;
}

const RejectedItemsView: React.FC<Props> = () => {
  const [subCategories, setSubCategories] = useState<SubCategoryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingReason, setViewingReason] = useState<{ id: string; reason: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const subCats = await getRejectedSubCategories();
      setSubCategories(subCats);
    } catch (error) {
      console.error("Failed to fetch rejected items:", error);
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
    { label: "Rejected By", key: "rejectedBy" },
    { label: "Rejected At", key: "rejectedAt" },
    { label: "Reason", key: "reason", align: "center" as const },
    { label: "Status", key: "status", align: "center" as const },
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-red-200">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
            <SearchBar
              placeholder="Search rejected items..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <>
            <ReusableTable
              columns={columns}
              data={displayItems}
              renderRow={(row: SubCategoryDto & { type: string }) => (
                <TableRow key={row.id} className="hover:bg-red-50">
                  <TableCell className="py-3 px-4 font-medium text-red-900">{row.name}</TableCell>
                  <TableCell className="py-3 px-4 text-red-700" align="right">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {row.pricePerYear?.toFixed(2) || "0.00"}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-red-700">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {row.rejectedBy || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-red-700">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {row.rejectedAt ? new Date(row.rejectedAt).toLocaleDateString() : "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-center">
                    {row.rejectedReason ? (
                      <button
                        onClick={() => setViewingReason({ id: row.id, reason: row.rejectedReason || "" })}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
                      >
                        <MessageSquare className="w-4 h-4" />
                        View Reason
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">No reason provided</span>
                    )}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-center">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                      <XCircle className="w-4 h-4 inline mr-1" />
                      Rejected
                    </span>
                  </TableCell>
                </TableRow>
              )}
            />
            {displayItems.length === 0 && (
              <div className="text-center py-12">
                <div className="text-red-400 text-6xl mb-4">✗</div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">No Rejected Items</h3>
                <p className="text-red-600">Rejected items will appear here</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Reason View Modal */}
      {viewingReason && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-red-900 mb-4">
              Rejection Reason
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Subcategory:</strong> {subCategories.find(s => s.id === viewingReason.id)?.name || "N/A"}
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 whitespace-pre-wrap">
                  {viewingReason.reason}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setViewingReason(null)}
                className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RejectedItemsView;

