import React, { useState, useEffect } from "react";
import { 
  getFinanceAnalytics,
  type FinanceAnalytics
} from "../../../api/Finance/financeOfficerApi";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnalyticsSummary from "../../../components/Finance/AnalyticsSummary";

const FinanceDash: React.FC = () => {
  const [analytics, setAnalytics] = useState<FinanceAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const data = await getFinanceAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 to-yellow-50/50">
      {/* Header */}
      <div className="bg-white border-b border-amber-200 shadow-sm mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
                Finance Officer Dashboard
              </h1>
              <p className="text-amber-700 mt-1">
                Overview and analytics for category and subcategory applications
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 px-4 py-2 rounded-xl">
                <DollarSign className="w-6 h-6 text-amber-700" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 px-6">
          <div 
            className="bg-white rounded-xl p-4 shadow-sm border border-amber-200 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate("/finance-applications?tab=pending")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-medium">Pending</p>
                <p className="text-2xl font-bold text-amber-900 mt-1">
                  {analytics.totalPending}
                </p>
                <p className="text-xs text-amber-500 mt-1 flex items-center gap-1">
                  Click to review <ArrowRight className="w-3 h-3" />
                </p>
              </div>
              <Clock className="w-8 h-8 text-amber-500" />
            </div>
          </div>
          <div 
            className="bg-white rounded-xl p-4 shadow-sm border border-green-200 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate("/finance-applications?tab=approved")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Approved</p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  {analytics.totalApproved}
                </p>
                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                  View details <ArrowRight className="w-3 h-3" />
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div 
            className="bg-white rounded-xl p-4 shadow-sm border border-red-200 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate("/finance-applications?tab=rejected")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Rejected</p>
                <p className="text-2xl font-bold text-red-900 mt-1">
                  {analytics.totalRejected}
                </p>
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  View details <ArrowRight className="w-3 h-3" />
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Revenue Impact</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  ${analytics.totalRevenueImpact?.toLocaleString() || "0"}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Card */}
      <div className="px-6 mb-6">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Review Applications</h2>
              <p className="text-amber-100">
                Go to the Applications page to review, approve, or reject pending category and subcategory applications.
              </p>
            </div>
            <button
              onClick={() => navigate("/finance-applications")}
              className="bg-white text-amber-700 px-6 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors flex items-center gap-2"
            >
              Go to Applications
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="px-6 pb-6">
        <AnalyticsSummary analytics={analytics} />
      </div>
    </div>
  );
};

export default FinanceDash;
