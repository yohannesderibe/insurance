import React from "react";
import type { FinanceAnalytics } from "../../api/Finance/financeOfficerApi";
import { TrendingUp, Clock, CheckCircle, XCircle, DollarSign, BarChart3 } from "lucide-react";

interface Props {
  analytics: FinanceAnalytics | null;
}

const AnalyticsSummary: React.FC<Props> = ({ analytics }) => {
  if (!analytics) {
    return (
      <div className="bg-white rounded-xl p-12 text-center border border-amber-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
        <p className="text-amber-600 mt-4">Loading analytics...</p>
      </div>
    );
  }

  const approvalRate = analytics.totalApproved + analytics.totalRejected > 0
    ? ((analytics.totalApproved / (analytics.totalApproved + analytics.totalRejected)) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-amber-600" />
            <span className="text-2xl font-bold text-amber-900">{analytics.totalPending}</span>
          </div>
          <p className="text-sm font-medium text-amber-700">Pending Review</p>
          <div className="mt-2 text-xs text-amber-600">
            {analytics.pendingCategories} categories, {analytics.pendingSubCategories} subcategories
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-900">{analytics.totalApproved}</span>
          </div>
          <p className="text-sm font-medium text-green-700">Approved Items</p>
          <div className="mt-2 text-xs text-green-600">
            {analytics.approvedCategories} categories, {analytics.approvedSubCategories} subcategories
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-red-900">{analytics.totalRejected}</span>
          </div>
          <p className="text-sm font-medium text-red-700">Rejected Items</p>
          <div className="mt-2 text-xs text-red-600">
            {analytics.rejectedCategories} categories, {analytics.rejectedSubCategories} subcategories
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Approval Rate */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-amber-100 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900">Approval Rate</h3>
              <p className="text-sm text-amber-600">Overall approval percentage</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-amber-900">{approvalRate}%</span>
            </div>
            <div className="mt-4 bg-amber-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-500"
                style={{ width: `${approvalRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Revenue Impact */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Revenue Impact</h3>
              <p className="text-sm text-blue-600">Total approved pricing</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-blue-900">
                ${analytics.totalRevenueImpact?.toLocaleString() || "0"}
              </span>
            </div>
            <p className="text-sm text-blue-600 mt-2">
              Based on approved items pricing
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown by Type */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-200">
        <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Breakdown by Type
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Categories */}
          <div>
            <h4 className="font-medium text-amber-800 mb-3">Categories</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-amber-50 rounded">
                <span className="text-sm text-amber-700">Pending</span>
                <span className="font-semibold text-amber-900">{analytics.pendingCategories}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="text-sm text-green-700">Approved</span>
                <span className="font-semibold text-green-900">{analytics.approvedCategories}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                <span className="text-sm text-red-700">Rejected</span>
                <span className="font-semibold text-red-900">{analytics.rejectedCategories}</span>
              </div>
            </div>
          </div>

          {/* Subcategories */}
          <div>
            <h4 className="font-medium text-amber-800 mb-3">Subcategories</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-amber-50 rounded">
                <span className="text-sm text-amber-700">Pending</span>
                <span className="font-semibold text-amber-900">{analytics.pendingSubCategories}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="text-sm text-green-700">Approved</span>
                <span className="font-semibold text-green-900">{analytics.approvedSubCategories}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                <span className="text-sm text-red-700">Rejected</span>
                <span className="font-semibold text-red-900">{analytics.rejectedSubCategories}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSummary;