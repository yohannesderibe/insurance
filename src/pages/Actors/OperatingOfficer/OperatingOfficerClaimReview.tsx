import React, { useEffect, useMemo, useState } from "react";
import { TableRow, TableCell } from "@mui/material";
import ReusableTable from "../../../components/Tables/ReusableTable";
import { Search, CheckCircle, XCircle, FileText, StickyNote, Calendar, Eye, DollarSign, AlertCircle } from "lucide-react";
import {
  getOperatorClaims,
  updateOperatorClaimStatus,
  type CustomerClaim,
  type OperatorClaimDto,
} from "../../../api/OperatingOfficer/claimReviewApi";

type FilterStatus = "All" | "Submitted" | "In Review" | "Approved" | "Rejected" | "Paid";

// Notes Modal (existing)
const NotesModal: React.FC<{ claim: CustomerClaim | null; onClose: () => void; onSaved: () => void; }> = ({ claim, onClose, onSaved }) => {
  const [notes, setNotes] = useState<string>(claim?.notes ?? "");
  useEffect(() => { setNotes(claim?.notes ?? ""); }, [claim]);
  
  const save = async () => {
    if (!claim) return;
    await updateOperatorClaimStatus(claim.id, claim.status as any, notes);
    onSaved();
  };
  
  if (!claim) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg bg-white rounded-xl border border-amber-200 shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-amber-900">Add Notes</h3>
          <button onClick={onClose} className="px-3 py-1 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50">Close</button>
        </div>
        <textarea 
          value={notes} 
          onChange={e => setNotes(e.target.value)} 
          rows={6} 
          className="w-full border border-amber-200 rounded-lg p-2 text-sm focus:ring-1 focus:ring-amber-500" 
          placeholder="Enter notes about this claim..."
        />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50">Cancel</button>
          <button onClick={save} className="px-4 py-2 text-sm rounded-lg bg-amber-500 text-white hover:bg-amber-600">Save Notes</button>
        </div>
      </div>
    </div>
  );
};

// Approval Modal
const ApprovalModal: React.FC<{ 
  claim: CustomerClaim | null; 
  onClose: () => void; 
  onApproved: (amount: number) => void; 
}> = ({ claim, onClose, onApproved }) => {
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      onApproved(parseFloat(amount));
    } finally {
      setLoading(false);
    }
  };

  if (!claim) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-white rounded-xl border border-green-200 shadow-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-green-100">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Approve Claim</h3>
            <p className="text-sm text-gray-600">Claim #{claim.claimNumber}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Approved Amount ($)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-10 p-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter approved amount"
              step="0.01"
              min="0"
              autoFocus
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Original requested amount: ${claim.amountRequested.toLocaleString()}
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleApprove}
            disabled={loading || !amount}
            className="px-4 py-2 text-sm rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Approve Claim
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Rejection Modal
const RejectionModal: React.FC<{ 
  claim: CustomerClaim | null; 
  onClose: () => void; 
  onRejected: (reason: string) => void; 
}> = ({ claim, onClose, onRejected }) => {
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    if (!reason.trim()) {
      alert("Please enter a rejection reason");
      return;
    }

    setLoading(true);
    try {
      onRejected(reason);
    } finally {
      setLoading(false);
    }
  };

  if (!claim) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-white rounded-xl border border-red-200 shadow-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-red-100">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Reject Claim</h3>
            <p className="text-sm text-gray-600">Claim #{claim.claimNumber}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rejection Reason
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Please provide a detailed reason for rejection..."
            rows={4}
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-2">
            This reason will be shared with the client
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleReject}
            disabled={loading || !reason.trim()}
            className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                Reject Claim
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Details Modal with improved styling
const DetailsModal: React.FC<{ 
  claim: CustomerClaim | null; 
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  backendData?: OperatorClaimDto;
}> = ({ claim, onClose, onApprove, onReject, backendData }) => {
  if (!claim) return null;
  
  // Format time from "101.00:00:00" to readable format
  const formatIncidentTime = (timeString: string) => {
    if (!timeString) return "Not specified";
    const parts = timeString.split('.');
    if (parts.length === 2) {
      const [days, time] = parts;
      return `${days} days, ${time}`;
    }
    return timeString;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-xl border border-amber-200 shadow-2xl my-8">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-amber-900">Claim Details</h3>
              <p className="text-amber-700 mt-1">Complete information for claim #{claim.claimNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Claim Information */}
            <div className="space-y-6">
              <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-5">
                <h4 className="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Claim Information
                </h4>
                <div className="space-y-3">
                  <DetailItem label="Claim ID" value={claim.id} />
                  <DetailItem label="Claim Number" value={claim.claimNumber} />
                  <DetailItem label="Status" value={
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      claim.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      claim.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      claim.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {claim.status}
                    </span>
                  } />
                  <DetailItem label="Policy Type" value={claim.type} />
                  <DetailItem label="Policy Name" value={claim.policyName} />
                  {claim.policyNumber && <DetailItem label="Policy Number" value={claim.policyNumber} />}
                </div>
              </div>

              {/* Financial Information */}
              <div className="bg-green-50/50 border border-green-100 rounded-xl p-5">
                <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Financial Information
                </h4>
                <div className="space-y-3">
                  <DetailItem label="Amount Requested" value={`$${claim.amountRequested.toLocaleString()}`} />
                  {claim.amountApproved && (
                    <DetailItem label="Amount Approved" value={`$${claim.amountApproved.toLocaleString()}`} />
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Incident & Client Information */}
            <div className="space-y-6">
              {/* Incident Details */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
                <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Incident Details
                </h4>
                <div className="space-y-3">
                  <DetailItem label="Incident Date" value={new Date(claim.incidentDate).toLocaleDateString()} />
                  <DetailItem label="Submitted On" value={new Date(claim.submittedOn).toLocaleDateString()} />
                  {backendData && (
                    <>
                      <DetailItem label="Incident Time" value={formatIncidentTime(backendData.incidentTime)} />
                      <DetailItem label="Location" value={backendData.location} />
                      <DetailItem label="Incident Type" value={backendData.incidentType} />
                    </>
                  )}
                </div>
              </div>

              {/* Client Information */}
              <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-5">
                <h4 className="text-lg font-semibold text-purple-800 mb-4">
                  Client Information
                </h4>
                {backendData ? (
                  <div className="space-y-3">
                    <DetailItem label="Full Name" value={
                      `${backendData.clientFirstName} ${backendData.clientFatherName} ${backendData.clientGrandFatherName}`
                    } />
                    <DetailItem label="Email" value={backendData.clientEmail} />
                    <DetailItem label="Client ID" value={backendData.clientId} />
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Loading client information...</p>
                )}
              </div>

              {/* Description */}
              <div className="border border-gray-200 rounded-xl p-5">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Description
                </h4>
                <p className="text-gray-700 whitespace-pre-wrap">{claim.description}</p>
              </div>
            </div>
          </div>

          {/* Attachments Section */}
          {claim.attachments && claim.attachments.length > 0 && (
            <div className="mt-6 border border-gray-200 rounded-xl p-5">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Attachments ({claim.attachments.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {claim.attachments.map((attachment, index) => {
                  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment);
                  const isPDF = /\.pdf$/i.test(attachment);
                  const fileName = attachment.split('/').pop() || `Attachment ${index + 1}`;
                  
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          isImage ? 'bg-blue-100' :
                          isPDF ? 'bg-red-100' :
                          'bg-gray-100'
                        }`}>
                          {isImage ? '🖼️' : isPDF ? '📄' : '📎'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
                          <p className="text-xs text-gray-500">
                            {isImage ? 'Image' : isPDF ? 'PDF Document' : 'File'}
                          </p>
                        </div>
                        <a
                          href={attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes Section */}
          {claim.notes && (
            <div className="mt-6 border border-amber-200 rounded-xl p-5 bg-amber-50/30">
              <h4 className="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
                <StickyNote className="w-5 h-5" />
                Internal Notes
              </h4>
              <p className="text-amber-900 whitespace-pre-wrap">{claim.notes}</p>
            </div>
          )}
        </div>

        {/* Footer with Action Buttons */}
        <div className="sticky bottom-0 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 p-6 rounded-b-xl">
          <div className="flex justify-between items-center">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close Details
            </button>
            <div className="flex gap-3">
              <button
                onClick={onReject}
                className="px-5 py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Reject Claim
              </button>
              <button
                onClick={onApprove}
                className="px-5 py-2.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Approve Claim
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for detail items
const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
    <span className="text-sm font-medium text-gray-600">{label}</span>
    <span className="text-sm text-gray-900 text-right max-w-xs">{value}</span>
  </div>
);

const OperatingOfficerClaimReview: React.FC = () => {
  const [claims, setClaims] = useState<CustomerClaim[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<FilterStatus>("All");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [notesFor, setNotesFor] = useState<CustomerClaim | null>(null);
  const [detailsFor, setDetailsFor] = useState<CustomerClaim | null>(null);
  const [approveFor, setApproveFor] = useState<CustomerClaim | null>(null);
  const [rejectFor, setRejectFor] = useState<CustomerClaim | null>(null);
  const [backendDataMap, setBackendDataMap] = useState<Record<string, OperatorClaimDto>>({});

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const data = await getOperatorClaims();
      setClaims(data);
      
      // Store backend data for details view
      // Note: This requires getOperatorClaims to also return raw backend data
      // or we need to fetch it separately. For now, we'll handle this in details modal
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchClaims(); 
  }, []);

  const filtered = useMemo(() => {
    return claims.filter(c => {
      const matchesText = `${c.claimNumber} ${c.policyName}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "All" ? true : c.status === status;
      const submitted = new Date(c.submittedOn).getTime();
      const fromOk = dateFrom ? submitted >= new Date(dateFrom).getTime() : true;
      const toOk = dateTo ? submitted <= new Date(dateTo).getTime() : true;
      return matchesText && matchesStatus && fromOk && toOk;
    });
  }, [claims, search, status, dateFrom, dateTo]);

  const handleApprove = async (claimId: string, amount: number) => {
    try {
      await updateOperatorClaimStatus(claimId, "Approved", `Amount approved: $${amount}`);
      // Here you would also update the amountApproved field
      // This requires a separate API call or an updated API endpoint
      await fetchClaims();
      alert(`Claim approved with amount: $${amount.toLocaleString()}`);
      setApproveFor(null);
    } catch (error) {
      alert("Error approving claim");
      console.error(error);
    }
  };

  const handleReject = async (claimId: string, reason: string) => {
    try {
      await updateOperatorClaimStatus(claimId, "Rejected", `Rejection reason: ${reason}`);
      await fetchClaims();
      alert("Claim rejected");
      setRejectFor(null);
    } catch (error) {
      alert("Error rejecting claim");
      console.error(error);
    }
  };

  const setInReview = async (id: string) => {
    try {
      await updateOperatorClaimStatus(id, "In Review");
      await fetchClaims();
    } catch (error) {
      alert("Error updating claim status");
      console.error(error);
    }
  };

  const columns = [
    { label: "Claim #", key: "claimNumber" },
    { label: "Policy", key: "policyName" },
    { label: "Type", key: "type" },
    { label: "Submitted", key: "submittedOn" },
    { label: "Amount", key: "amountRequested", align: "right" as const },
    { label: "Status", key: "status" },
    { label: "Actions", key: "actions", align: "center" as const },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 to-yellow-50/50">
      <div className="bg-white border-b border-amber-200 shadow-sm mb-6">
        <div className="p-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">Claims Review</h1>
          <p className="text-amber-700 mt-1">Review and manage submitted insurance claims</p>
        </div>
      </div>

      <div className="px-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Search by claim # or policy..." 
                className="w-full border border-amber-200 rounded-lg pl-10 p-2 text-sm focus:ring-1 focus:ring-amber-500" 
              />
            </div>
            <div>
              <select 
                value={status} 
                onChange={e => setStatus(e.target.value as FilterStatus)} 
                className="w-full border border-amber-200 rounded-lg p-2 text-sm"
              >
                {(["All","Submitted","In Review","Approved","Rejected","Paid"] as FilterStatus[]).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
              <input 
                type="date" 
                value={dateFrom} 
                onChange={e => setDateFrom(e.target.value)} 
                className="w-full border border-amber-200 rounded-lg pl-10 p-2 text-sm" 
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
              <input 
                type="date" 
                value={dateTo} 
                onChange={e => setDateTo(e.target.value)} 
                className="w-full border border-amber-200 rounded-lg pl-10 p-2 text-sm" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="bg-white rounded-xl shadow-sm border border-amber-200 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
          ) : (
            <>
              <ReusableTable
                columns={columns}
                data={filtered}
                renderRow={(row: CustomerClaim) => (
                  <TableRow key={row.id} className="hover:bg-amber-50">
                    <TableCell className="py-3 px-4 font-medium text-amber-900">{row.claimNumber}</TableCell>
                    <TableCell className="py-3 px-4 text-amber-800">{row.policyName}</TableCell>
                    <TableCell className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row.type === "Motor" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                      }`}>
                        {row.type}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-amber-700">{new Date(row.submittedOn).toLocaleDateString()}</TableCell>
                    <TableCell className="py-3 px-4 text-amber-700 font-medium" align="right">
                      ${row.amountRequested.toLocaleString()}
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        row.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        row.status === 'Submitted' || row.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {row.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-1">
                        <button 
                          onClick={() => setDetailsFor(row)} 
                          className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors" 
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setNotesFor(row)} 
                          className="p-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700 transition-colors" 
                          title="Add Notes"
                        >
                          <StickyNote className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setInReview(row.id)} 
                          className="p-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-700 transition-colors" 
                          title="Mark In Review"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setApproveFor(row)} 
                          className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 transition-colors" 
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setRejectFor(row)} 
                          className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors" 
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              />
              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-amber-400 text-6xl mb-4">📑</div>
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">No Claims Found</h3>
                  <p className="text-amber-600">No items match your search criteria</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Notes Modal */}
      {notesFor && (
        <NotesModal
          claim={notesFor}
          onClose={() => setNotesFor(null)}
          onSaved={async () => { 
            setNotesFor(null); 
            await fetchClaims(); 
          }}
        />
      )}

      {/* Approval Modal */}
      {approveFor && (
        <ApprovalModal
          claim={approveFor}
          onClose={() => setApproveFor(null)}
          onApproved={(amount) => handleApprove(approveFor.id, amount)}
        />
      )}

      {/* Rejection Modal */}
      {rejectFor && (
        <RejectionModal
          claim={rejectFor}
          onClose={() => setRejectFor(null)}
          onRejected={(reason) => handleReject(rejectFor.id, reason)}
        />
      )}

      {/* Details Modal */}
      {detailsFor && (
        <DetailsModal
          claim={detailsFor}
          onClose={() => setDetailsFor(null)}
          onApprove={() => {
            setDetailsFor(null);
            setApproveFor(detailsFor);
          }}
          onReject={() => {
            setDetailsFor(null);
            setRejectFor(detailsFor);
          }}
          // Pass backend data if available
          backendData={backendDataMap[detailsFor.id]}
        />
      )}
    </div>
  );
};

export default OperatingOfficerClaimReview;