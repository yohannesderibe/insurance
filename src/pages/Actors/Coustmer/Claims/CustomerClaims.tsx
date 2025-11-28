import React, { useEffect, useMemo, useState } from "react";
import { getCustomerClaims } from "../../../../api/Coustomer/Claims/claimsApi";
import type { CustomerClaim } from "../../../../mockdata/claims";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Search,
  Filter,
  CalendarDays,
  Clock,
  MessageSquare,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const STATUS_OPTIONS = ["All", "Submitted", "In Review", "Approved", "Rejected", "Paid"] as const;

const statusColors: Record<CustomerClaim["status"], string> = {
  Submitted: "bg-amber-100 text-amber-700",
  "In Review": "bg-blue-100 text-blue-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
  Paid: "bg-purple-100 text-purple-700"
};

const CustomerClaims: React.FC = () => {
  const navigate = useNavigate();
  const [claims, setClaims] = useState<CustomerClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<typeof STATUS_OPTIONS[number]>("All");
  const [viewingClaim, setViewingClaim] = useState<CustomerClaim | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await getCustomerClaims();
      setClaims(result);
      setLoading(false);
    })();
  }, []);

  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      const matchesStatus = statusFilter === "All" || claim.status === statusFilter;
      const matchesSearch =
        claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.policyName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [claims, statusFilter, searchTerm]);

  const stats = useMemo(() => {
    const pending = claims.filter((c) => c.status === "Submitted" || c.status === "In Review").length;
    const approved = claims.filter((c) => c.status === "Approved").length;
    const paidAmount = claims
      .filter((c) => c.status === "Paid" && c.amountApproved)
      .reduce((sum, c) => sum + (c.amountApproved ?? 0), 0);
    return { pending, approved, paidAmount };
  }, [claims]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900">Claims Center</h1>
          <p className="text-amber-700 text-base">
            Review claim progress, track payouts, and submit new claims in one place.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
            onClick={() => navigate("/claims/file")}
            className="px-5 py-2 rounded-xl bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 transition-colors">
              File New Claim
            </button>
            <button className="px-5 py-2 rounded-xl border border-amber-200 text-amber-700 font-semibold text-sm hover:bg-amber-50 transition-colors">
              Download Claim Guide
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Claims In Review</p>
              <p className="text-2xl font-bold text-blue-900">{stats.pending}</p>
            </div>
          </div>
          <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-emerald-600 font-medium">Approved This Year</p>
              <p className="text-2xl font-bold text-emerald-900">{stats.approved}</p>
            </div>
          </div>
          <div className="bg-white border border-purple-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="bg-purple-100 text-purple-600 p-3 rounded-2xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Payout</p>
              <p className="text-2xl font-bold text-purple-900">${stats.paidAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-amber-100 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search claims by number or policy name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-amber-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-amber-300"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-amber-700 font-medium">
              <Filter className="w-4 h-4" />
              <span>Status:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? "bg-amber-500 text-white"
                      : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Claims list */}
        <div className="bg-white border border-amber-100 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500" />
            </div>
          ) : filteredClaims.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <p className="text-amber-900 font-semibold text-lg">No claims found</p>
              <p className="text-amber-600 text-sm">Start by filing a new claim.</p>
            </div>
          ) : (
            <div className="divide-y divide-amber-100">
              {filteredClaims.map((claim) => (
                <div key={claim.id} className="p-5 flex flex-col md:flex-row gap-4 md:items-center">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-3 items-center">
                      <p className="text-sm text-amber-600 font-semibold">{claim.claimNumber}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[claim.status]}`}>
                        {claim.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-amber-900">{claim.policyName}</h3>
                    <p className="text-sm text-amber-700">{claim.type}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-amber-800 mt-3">
                      <span className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4" />
                        Submitted {new Date(claim.submittedOn).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Requested ${claim.amountRequested.toLocaleString()}
                      </span>
                      {claim.amountApproved && (
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Approved ${claim.amountApproved.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewingClaim(claim)}
                      className="px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors"
                    >
                      View Details
                    </button>
                    <button className="px-4 py-2 rounded-xl border border-amber-200 text-amber-700 text-sm font-semibold hover:bg-amber-50 transition-colors">
                      Download PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Claim details modal */}
      {viewingClaim && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-semibold">{viewingClaim.claimNumber}</p>
                <h2 className="text-2xl font-bold text-amber-900">{viewingClaim.policyName}</h2>
              </div>
              <button
                onClick={() => setViewingClaim(null)}
                className="p-2 rounded-full hover:bg-amber-50 text-amber-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-amber-50 rounded-xl p-4 space-y-2 text-amber-900">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-amber-600" />
                  <span>
                    Incident: {new Date(viewingClaim.incidentDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Submitted: {new Date(viewingClaim.submittedOn).toLocaleDateString()}</span>
                </div>
                {viewingClaim.updatedOn && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Updated: {new Date(viewingClaim.updatedOn).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              <div className="bg-amber-50 rounded-xl p-4 space-y-2 text-amber-900">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  <span>Requested: ${viewingClaim.amountRequested.toLocaleString()}</span>
                </div>
                {viewingClaim.amountApproved && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Approved: ${viewingClaim.amountApproved.toLocaleString()}</span>
                  </div>
                )}
                {viewingClaim.payoutDate && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-purple-600" />
                    <span>Payout Date: {new Date(viewingClaim.payoutDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-amber-100 rounded-xl p-4">
              <p className="text-xs text-amber-600 font-semibold uppercase mb-2">Description</p>
              <p className="text-sm text-amber-900">{viewingClaim.description}</p>
            </div>

            {viewingClaim.notes && (
              <div className="bg-white border border-amber-100 rounded-xl p-4">
                <div className="flex items-center gap-2 text-amber-700 mb-2">
                  <MessageSquare className="w-4 h-4" />
                  <p className="text-xs font-semibold uppercase">Adjuster Notes</p>
                </div>
                <p className="text-sm text-amber-900">{viewingClaim.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerClaims;

