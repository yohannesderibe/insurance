import React, { useEffect, useMemo, useState } from "react";
import { getClientClaims, type ClaimViewDto, resolveClaimType, type ClaimType } from "../../../../api/Coustomer/Claims/claimViewApi";
import {FileText,CheckCircle2,AlertTriangle,DollarSign,Search,Filter,CalendarDays,Clock,MessageSquare,X,MapPin,Shield,Car,Heart,FileWarning,RefreshCw} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Define the frontend claim type that extends the API type
interface CustomerClaim extends ClaimViewDto {
  claimNumber: string;
  policyName: string;
  claimType: ClaimType;
  amountRequested: number;
  amountApproved?: number;
  payoutDate?: Date | null;
  notes?: string | null;
}

// Status options for filtering
const STATUS_OPTIONS = ["All", "Pending", "Approved", "Rejected", "Paid"] as const;

// Map API status to display status
const mapApiStatus = (apiStatus: string): string => {
  const statusMap: Record<string, string> = {
    'Pending': 'Pending',
    'Submitted': 'Pending',
    'InReview': 'In Review',
    'Approved': 'Approved',
    'Rejected': 'Rejected',
    'Paid': 'Paid',
  };
  return statusMap[apiStatus] || apiStatus;
};

// Status colors
const statusColors: Record<string, string> = {
  'Pending': "bg-amber-100 text-amber-700",
  'In Review': "bg-blue-100 text-blue-700",
  'Submitted': "bg-amber-100 text-amber-700",
  'Approved': "bg-emerald-100 text-emerald-700",
  'Rejected': "bg-red-100 text-red-700",
  'Paid': "bg-purple-100 text-purple-700"
};

// Claim type icons
const claimTypeIcons: Record<ClaimType, React.ElementType> = {
  Motor: Car,
  Life: Heart,
  Unknown: Shield,
};

// Transform API claim to frontend claim
const transformClaim = (apiClaim: ClaimViewDto): CustomerClaim => {
  const claimType = resolveClaimType(apiClaim);
  
  // Generate a user-friendly claim number
  const claimNumber = `CLM-${apiClaim.claimId.slice(0, 8).toUpperCase()}`;
  
  // Create policy name based on claim type
  const policyName = claimType === 'Motor' 
    ? `Motor Insurance ${apiClaim.motorInsuranceApplicationId?.slice(0, 8) || ''}`
    : claimType === 'Life'
    ? `Life Insurance ${apiClaim.lifeInsuranceApplicationId?.slice(0, 8) || ''}`
    : 'Insurance Policy';
  
  // For demo purposes - generate mock amounts
  // In production, these should come from your API
  const amountRequested = Math.floor(Math.random() * 10000) + 1000;
  const amountApproved = apiClaim.status === 'Approved' || apiClaim.status === 'Paid'
    ? Math.floor(amountRequested * 0.8) + 500
    : undefined;
  
  return {
    ...apiClaim,
    claimNumber,
    policyName,
    claimType,
    amountRequested,
    amountApproved,
    payoutDate: apiClaim.status === 'Paid' ? new Date() : null,
    notes: apiClaim.status === 'Rejected' 
      ? 'Additional documentation required for verification.' 
      : apiClaim.status === 'Approved' 
      ? 'Claim approved for payout processing.'
      : null,
  };
};

const CustomerClaims: React.FC = () => {
  const navigate = useNavigate();
  const [claims, setClaims] = useState<CustomerClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<typeof STATUS_OPTIONS[number]>("All");
  const [viewingClaim, setViewingClaim] = useState<CustomerClaim | null>(null);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiClaims = await getClientClaims();
      const transformedClaims = apiClaims.map(transformClaim);
      setClaims(transformedClaims);
    } catch (err) {
      console.error('Failed to fetch claims:', err);
      setError('Failed to load claims. Please check your connection and try again.');
      // Fallback to empty array if API fails
      setClaims([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      const matchesStatus = statusFilter === "All" || mapApiStatus(claim.status) === statusFilter;
      const matchesSearch =
        claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.policyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.claimType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [claims, statusFilter, searchTerm]);

  const stats = useMemo(() => {
    const pending = claims.filter((c) => 
      mapApiStatus(c.status) === 'Pending' || mapApiStatus(c.status) === 'In Review'
    ).length;
    const approved = claims.filter((c) => 
      mapApiStatus(c.status) === 'Approved' || mapApiStatus(c.status) === 'Paid'
    ).length;
    const paidAmount = claims
      .filter((c) => mapApiStatus(c.status) === 'Paid' && c.amountApproved)
      .reduce((sum, c) => sum + (c.amountApproved ?? 0), 0);
    return { pending, approved, paidAmount };
  }, [claims]);

  const ClaimTypeIcon = viewingClaim ? claimTypeIcons[viewingClaim.claimType] : Shield;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const formatTime = (timeString: string) => {
    // Handle the time format from your API (e.g., "101.00:00:00")
    if (!timeString) return 'N/A';
    return timeString.split('.')[1] || timeString;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-amber-900">Claims Center</h1>
              <p className="text-amber-700 text-base mt-2">
                Review claim progress, track payouts, and submit new claims in one place.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/claims/file")}
                className="px-5 py-2 rounded-xl bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                File New Claim
              </button>
              <button
                onClick={fetchClaims}
                disabled={loading}
                className="px-5 py-2 rounded-xl border border-amber-200 text-amber-700 font-semibold text-sm hover:bg-amber-50 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

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
              <p className="text-sm text-emerald-600 font-medium">Approved Claims</p>
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
                placeholder="Search by claim number, policy, type, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-amber-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-amber-300 focus:border-amber-300 outline-none transition"
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

        {/* Claims List */}
        <div className="bg-white border border-amber-100 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mb-4" />
              <p className="text-amber-700">Loading your claims...</p>
            </div>
          ) : filteredClaims.length === 0 ? (
            <div className="text-center py-16">
              <FileWarning className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <p className="text-amber-900 font-semibold text-lg">No claims found</p>
              <p className="text-amber-600 text-sm mt-1">
                {claims.length === 0 
                  ? "You haven't filed any claims yet. File your first claim to get started."
                  : "No claims match your search criteria."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-amber-100">
              {filteredClaims.map((claim) => {
                const displayStatus = mapApiStatus(claim.status);
                const ClaimIcon = claimTypeIcons[claim.claimType];
                
                return (
                  <div key={claim.claimId} className="p-5 hover:bg-amber-50/50 transition-colors">
                    <div className="flex flex-col md:flex-row gap-4 md:items-center">
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-3 items-center mb-2">
                          <p className="text-sm text-amber-600 font-semibold">{claim.claimNumber}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[displayStatus]}`}>
                            {displayStatus}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-amber-600">
                            <ClaimIcon className="w-4 h-4" />
                            {claim.claimType}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-amber-900 mb-1">{claim.policyName}</h3>
                        <p className="text-sm text-amber-700 mb-3">{claim.incidentType}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-amber-800">
                          <span className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4" />
                            Incident: {formatDate(claim.incidentDate)}
                          </span>
                          <span className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {claim.location || 'Location not specified'}
                          </span>
                          {claim.amountRequested > 0 && (
                            <span className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4" />
                              Requested ${claim.amountRequested.toLocaleString()}
                            </span>
                          )}
                          {claim.amountApproved && (
                            <span className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4" />
                              Approved ${claim.amountApproved.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 self-start md:self-center">
                        <button
                          onClick={() => setViewingClaim(claim)}
                          className="px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors whitespace-nowrap"
                        >
                          View Details
                        </button>
                        <button className="px-4 py-2 rounded-xl border border-amber-200 text-amber-700 text-sm font-semibold hover:bg-amber-50 transition-colors whitespace-nowrap">
                          Download PDF
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Claim Details Modal */}
      {viewingClaim && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-8">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 p-2 rounded-xl">
                    <ClaimTypeIcon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-amber-600 font-semibold">{viewingClaim.claimNumber}</p>
                    <h2 className="text-2xl font-bold text-amber-900">{viewingClaim.policyName}</h2>
                  </div>
                </div>
                <button
                  onClick={() => setViewingClaim(null)}
                  className="p-2 rounded-full hover:bg-amber-50 text-amber-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors[mapApiStatus(viewingClaim.status)]}`}>
                  {mapApiStatus(viewingClaim.status)}
                </span>
                <span className="text-sm text-amber-600">
                  Filed on {formatDate(viewingClaim.createdAt)}
                </span>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-50 rounded-xl p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-amber-700 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    Incident Details
                  </h3>
                  <div className="space-y-2 text-sm text-amber-900">
                    <p><span className="font-medium">Date:</span> {formatDate(viewingClaim.incidentDate)}</p>
                    <p><span className="font-medium">Time:</span> {formatTime(viewingClaim.incidentTime)}</p>
                    <p><span className="font-medium">Location:</span> {viewingClaim.location || 'Not specified'}</p>
                    <p><span className="font-medium">Type:</span> {viewingClaim.incidentType}</p>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-xl p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-amber-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Financial Details
                  </h3>
                  <div className="space-y-2 text-sm text-amber-900">
                    <p><span className="font-medium">Claim Type:</span> {viewingClaim.claimType}</p>
                    <p><span className="font-medium">Amount Requested:</span> ${viewingClaim.amountRequested.toLocaleString()}</p>
                    {viewingClaim.amountApproved && (
                      <p><span className="font-medium">Amount Approved:</span> ${viewingClaim.amountApproved.toLocaleString()}</p>
                    )}
                    {viewingClaim.payoutDate && (
                      <p><span className="font-medium">Payout Date:</span> {formatDate(viewingClaim.payoutDate.toISOString())}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white border border-amber-100 rounded-xl p-4">
                <h3 className="text-xs text-amber-600 font-semibold uppercase mb-3">Description</h3>
                <p className="text-sm text-amber-900 whitespace-pre-line">{viewingClaim.description}</p>
              </div>

              {/* Evidence Section */}
              {viewingClaim.evidenceImageUrls && viewingClaim.evidenceImageUrls.length > 0 && (
                <div className="bg-white border border-amber-100 rounded-xl p-4">
                  <h3 className="text-xs text-amber-600 font-semibold uppercase mb-3">Evidence Files</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {viewingClaim.evidenceImageUrls.map((url, index) => (
                      <a
                        key={index}
                        href={`http://localhost:5150${url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-amber-50 hover:bg-amber-100 rounded-lg p-3 text-center transition-colors group"
                      >
                        <FileText className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                        <p className="text-xs font-medium text-amber-700 group-hover:text-amber-900">
                          Evidence {index + 1}
                        </p>
                        <p className="text-xs text-amber-500 mt-1">View File</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Police Report */}
              {viewingClaim.trafficPoliceReportPdfUrl && (
                <div className="bg-white border border-amber-100 rounded-xl p-4">
                  <h3 className="text-xs text-amber-600 font-semibold uppercase mb-3">Police Report</h3>
                  <a
                    href={`http://localhost:5150${viewingClaim.trafficPoliceReportPdfUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Download Police Report
                  </a>
                </div>
              )}

              {/* Notes */}
              {viewingClaim.notes && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-blue-700 mb-3">
                    <MessageSquare className="w-4 h-4" />
                    <h3 className="text-xs font-semibold uppercase">Adjuster Notes</h3>
                  </div>
                  <p className="text-sm text-blue-900">{viewingClaim.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-amber-100">
                <button
                  onClick={() => setViewingClaim(null)}
                  className="flex-1 px-4 py-3 rounded-xl border border-amber-200 text-amber-700 font-semibold hover:bg-amber-50 transition-colors"
                >
                  Close
                </button>
                <button className="flex-1 px-4 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors">
                  Download All Documents
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerClaims;