import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PendingItemsView from "../../../components/Finance/PendingItemsView";
import ApprovedItemsView from "../../../components/Finance/ApprovedItemsView";
import RejectedItemsView from "../../../components/Finance/RejectedItemsView";
import { CheckCircle, XCircle, Clock } from "lucide-react";

type TabType = "pending" | "approved" | "rejected";

const FinanceApplications: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") as TabType | null;
  const [activeTab, setActiveTab] = useState<TabType>(tabParam || "pending");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (tabParam && ["pending", "approved", "rejected"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 to-yellow-50/50">
      {/* Header */}
      <div className="bg-white border-b border-amber-200 shadow-sm mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
                Applications Review
              </h1>
              <p className="text-amber-700 mt-1">
                Review, approve, or reject subcategory applications (categories are auto-approved)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-1 inline-flex">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === "pending"
                ? "bg-amber-500 text-white shadow-md"
                : "text-amber-700 hover:bg-amber-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending Items
            </div>
          </button>
          <button
            onClick={() => setActiveTab("approved")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === "approved"
                ? "bg-green-500 text-white shadow-md"
                : "text-green-700 hover:bg-green-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Approved
            </div>
          </button>
          <button
            onClick={() => setActiveTab("rejected")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === "rejected"
                ? "bg-red-500 text-white shadow-md"
                : "text-red-700 hover:bg-red-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Rejected
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        {activeTab === "pending" && (
          <PendingItemsView onRefresh={handleRefresh} key={refreshKey} />
        )}
        {activeTab === "approved" && (
          <ApprovedItemsView />
        )}
        {activeTab === "rejected" && (
          <RejectedItemsView onRefresh={handleRefresh} />
        )}
      </div>
    </div>
  );
};

export default FinanceApplications;

