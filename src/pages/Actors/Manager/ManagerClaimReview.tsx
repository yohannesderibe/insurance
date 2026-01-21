import React, { useEffect, useMemo, useState } from "react";
import { TableRow, TableCell } from "@mui/material";
import ReusableTable from "../../../components/Tables/ReusableTable";
import { Search, CheckCircle, XCircle, FileText, StickyNote, Calendar, Eye, DollarSign, AlertCircle, ArrowLeftCircle, MessageSquare } from "lucide-react";
import {
    getManagerClaims,
    updateManagerClaimStatus
} from "../../../api/Manager/managerClaimApi";
import type { CustomerClaim } from "../../../mockdata/claims";

type FilterStatus = "All" | "Action Required" | "History";

// Feedback Modal
const FeedbackModal: React.FC<{
    claim: CustomerClaim | null;
    onClose: () => void;
    onConfirm: (feedback: string) => void;
    title: string;
    placeholder: string;
    isRejection?: boolean;
}> = ({ claim, onClose, onConfirm, title, placeholder, isRejection }) => {
    const [feedback, setFeedback] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!feedback.trim()) {
            alert("Please enter feedback");
            return;
        }

        setLoading(true);
        try {
            onConfirm(feedback);
        } finally {
            setLoading(false);
        }
    };

    if (!claim) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className={`w-full max-w-md bg-white rounded-xl border ${isRejection ? 'border-red-200' : 'border-amber-200'} shadow-xl p-6`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-full ${isRejection ? 'bg-red-100' : 'bg-amber-100'}`}>
                        {isRejection ? <XCircle className="w-6 h-6 text-red-600" /> : <MessageSquare className="w-6 h-6 text-amber-600" />}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                        <p className="text-sm text-gray-600">Claim #{claim.claimNumber}</p>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Feedback for Operator
                    </label>
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className={`w-full border ${isRejection ? 'border-red-300 focus:ring-red-500' : 'border-amber-300 focus:ring-amber-500'} rounded-lg p-3 text-sm focus:ring-2`}
                        placeholder={placeholder}
                        rows={4}
                        autoFocus
                    />
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
                        onClick={handleSubmit}
                        disabled={loading || !feedback.trim()}
                        className={`px-4 py-2 text-sm rounded-lg ${isRejection ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600'} text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Processing...
                            </>
                        ) : (
                            "Confirm"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Details Modal
const DetailsModal: React.FC<{
    claim: CustomerClaim | null;
    onClose: () => void;
    onApprove: () => void;
    onReject: () => void;
    onSendBack: () => void;
}> = ({ claim, onClose, onApprove, onReject, onSendBack }) => {
    if (!claim) return null;

    const isOperatorApproved = claim.status === 'OperatorApproved';
    const isOperatorRejected = claim.status === 'OperatorRejected';
    const canAct = isOperatorApproved || isOperatorRejected;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
            <div className="w-full max-w-4xl bg-white rounded-xl border border-amber-200 shadow-2xl my-8">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-200 p-6 rounded-t-xl z-20">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-amber-900">Manager Review</h3>
                            <p className="text-amber-700 mt-1">Reviewing Claim #{claim.claimNumber}</p>
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
                    {/* Operator Decision Box */}
                    <div className={`mb-6 p-4 rounded-xl border ${isOperatorApproved ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                        }`}>
                        <h4 className={`text-lg font-bold ${isOperatorApproved ? 'text-green-800' : 'text-red-800'
                            } mb-2`}>
                            Operator Decision: {isOperatorApproved ? 'Approved' : 'Rejected'}
                        </h4>
                        {isOperatorApproved && (
                            <p className="text-green-900">
                                Amount Proposed: <strong>${claim.amountApproved?.toLocaleString()}</strong>
                            </p>
                        )}
                        {isOperatorRejected && (
                            <p className="text-red-900">
                                Rejection Reason: "{claim.rejectionReason}"
                            </p>
                        )}
                        {claim.notes && (
                            <p className="text-gray-600 text-sm mt-2 italic">Operator Notes: {claim.notes}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                                <h4 className="font-semibold text-gray-800 mb-4">Claim Information</h4>
                                <div className="space-y-3">
                                    <DetailItem label="Policy Type" value={claim.type} />
                                    <DetailItem label="Policy Name" value={claim.policyName} />
                                    <DetailItem label="Amount Requested" value={`$${claim.amountRequested.toLocaleString()}`} />
                                    <DetailItem label="Incident Date" value={new Date(claim.incidentDate).toLocaleDateString()} />
                                </div>
                            </div>

                            <div className="border border-gray-200 rounded-xl p-5">
                                <h4 className="font-semibold text-gray-800 mb-4">Description</h4>
                                <p className="text-gray-700 whitespace-pre-wrap">{claim.description}</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            {/* Client info could go here if available */}
                            {claim.attachments && claim.attachments.length > 0 && (
                                <div className="border border-gray-200 rounded-xl p-5">
                                    <h4 className="font-semibold text-gray-800 mb-4">Attachments</h4>
                                    <ul className="list-disc pl-5 text-sm">
                                        {claim.attachments.map((a, i) => <li key={i}>{a}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer with Actions */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-xl z-20">
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Close
                        </button>

                        {isOperatorApproved && (
                            <>
                                <button
                                    onClick={onSendBack}
                                    className="px-5 py-2.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                                >
                                    Reject & Send Back
                                </button>
                                <button
                                    onClick={onApprove}
                                    className="px-5 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    Final Approve
                                </button>
                            </>
                        )}

                        {isOperatorRejected && (
                            <>
                                <button
                                    onClick={onSendBack}
                                    className="px-5 py-2.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                                >
                                    Disagree (Send Back)
                                </button>
                                <button
                                    onClick={onApprove} // Here "Approve" means Agree with Rejection -> Status "Rejected"
                                    className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2"
                                >
                                    <XCircle className="w-5 h-5" />
                                    Confirm Rejection
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className="text-sm text-gray-900 text-right max-w-xs">{value}</span>
    </div>
);

const ManagerClaimReview: React.FC = () => {
    const [claims, setClaims] = useState<CustomerClaim[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<FilterStatus>("Action Required");
    const [detailsFor, setDetailsFor] = useState<CustomerClaim | null>(null);
    const [feedbackFor, setFeedbackFor] = useState<{ claim: CustomerClaim, type: 'SendBack' | 'Reject' } | null>(null);

    const fetchClaims = async () => {
        setLoading(true);
        try {
            const data = await getManagerClaims();
            setClaims(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchClaims(); }, []);

    const filtered = useMemo(() => {
        if (filter === "All") return claims;
        if (filter === "Action Required") {
            return claims.filter(c => c.status === "OperatorApproved" || c.status === "OperatorRejected");
        }
        return claims.filter(c => c.status !== "OperatorApproved" && c.status !== "OperatorRejected");
    }, [claims, filter]);

    const handleApprove = async (claim: CustomerClaim) => {
        try {
            // If Operator Approved -> Manager Approve = Final Approved
            // If Operator Rejected -> Manager Approve (Agree) = Final Rejected
            await updateManagerClaimStatus(claim.id, "Approve");
            await fetchClaims();
            setDetailsFor(null);
            alert("Decision confirmed successfully.");
        } catch (error) {
            alert("Error processing request");
        }
    };

    const handleSendBack = async (claim: CustomerClaim, feedback: string) => {
        try {
            await updateManagerClaimStatus(claim.id, "SendBack", feedback);
            await fetchClaims();
            setFeedbackFor(null);
            setDetailsFor(null);
            alert("Claim returned to Operator.");
        } catch (error) {
            alert("Error processing request");
        }
    };

    const handleReject = async (claim: CustomerClaim, feedback: string) => {
        try {
            // This handles the "Manager rejects request" flow for Operator Approved items
            // Logic maps this to 'SendBack' basically, but with rejection intent
            await updateManagerClaimStatus(claim.id, "Reject", feedback);
            await fetchClaims();
            setFeedbackFor(null);
            setDetailsFor(null);
            alert("Request rejected and returned to Operator.");
        } catch (error) {
            alert("Error processing request");
        }
    };

    const columns = [
        { label: "Claim #", key: "claimNumber" },
        { label: "Amount", key: "amountRequested" },
        { label: "Operator Decision", key: "status" },
        { label: "Actions", key: "actions", align: "center" as const },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50/50 to-yellow-50/50 p-6">
            <div className="bg-white rounded-xl shadow-sm border border-amber-200 mb-6 p-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">Manager Verification</h1>
                <p className="text-amber-700">Double-check operator decisions before final processing.</p>

                <div className="mt-4 flex gap-2">
                    {["Action Required", "History", "All"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as FilterStatus)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
                                ? 'bg-amber-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-amber-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">Loading...</div>
                ) : (
                    <ReusableTable
                        columns={columns}
                        data={filtered}
                        renderRow={(row: CustomerClaim) => (
                            <TableRow key={row.id} className="hover:bg-gray-50">
                                <TableCell className="font-medium">{row.claimNumber}</TableCell>
                                <TableCell>
                                    {row.amountApproved ? (
                                        <span className="text-green-600 font-bold">${row.amountApproved.toLocaleString()}</span>
                                    ) : (
                                        <span>${row.amountRequested.toLocaleString()}</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${row.status === 'OperatorApproved' ? 'bg-green-100 text-green-800' :
                                        row.status === 'OperatorRejected' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                        {row.status === 'OperatorApproved' ? 'Approved by Operator' :
                                            row.status === 'OperatorRejected' ? 'Rejected by Operator' :
                                                row.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex justify-center gap-1">
                                        <button
                                            onClick={() => setDetailsFor(row)}
                                            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>

                                        {(row.status === 'OperatorApproved' || row.status === 'OperatorRejected') && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(row)}
                                                    className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 transition-colors"
                                                    title={row.status === 'OperatorApproved' ? "Final Approve" : "Data Agree (Confirm Rejection)"}
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (row.status === 'OperatorApproved') {
                                                            setFeedbackFor({ claim: row, type: 'Reject' });
                                                        } else {
                                                            setFeedbackFor({ claim: row, type: 'SendBack' });
                                                        }
                                                    }}
                                                    className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                                                    title={row.status === 'OperatorApproved' ? "Reject & Send Back" : "Disagree & Send Back"}
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    />
                )}
                {!loading && filtered.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No claims found requiring attention.
                    </div>
                )}
            </div>

            {detailsFor && (
                <DetailsModal
                    claim={detailsFor}
                    onClose={() => setDetailsFor(null)}
                    onApprove={() => handleApprove(detailsFor)}
                    onReject={() => {
                        // Manager Rejecting an APPROVED claim
                        setFeedbackFor({ claim: detailsFor, type: 'Reject' });
                    }}
                    onSendBack={() => {
                        // Manager Disagreeing with REJECTED claim
                        setFeedbackFor({ claim: detailsFor, type: 'SendBack' });
                    }}
                />
            )}

            {feedbackFor && (
                <FeedbackModal
                    claim={feedbackFor.claim}
                    onClose={() => setFeedbackFor(null)}
                    onConfirm={(feedback) => {
                        if (feedbackFor.type === 'Reject') {
                            handleReject(feedbackFor.claim, feedback);
                        } else {
                            handleSendBack(feedbackFor.claim, feedback);
                        }
                    }}
                    title={feedbackFor.type === 'Reject' ? "Reject & Return" : "Send Back for Review"}
                    placeholder={feedbackFor.type === 'Reject'
                        ? "Why are you rejecting this request? (Sent to Operator)"
                        : "Why do you disagree? (Sent to Operator)"}
                    isRejection={true}
                />
            )}
        </div>
    );
};

export default ManagerClaimReview;
