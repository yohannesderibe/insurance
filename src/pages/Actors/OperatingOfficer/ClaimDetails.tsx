import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClaims, updateClaimStatus } from "../../../api/OperatingOfficer/operatingOfficerApi";
import type { CustomerClaim } from "../../../mockdata/claims";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";

const ClaimDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState<CustomerClaim | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const data = await getClaims();
      setClaim(data.find(c => c.id === id) ?? null);
    };
    fetch();
  }, [id]);

  const approve = async () => {
    if (!claim) return;
    await updateClaimStatus(claim.id, "Approved");
    navigate("/operating-claims");
  };
  const reject = async () => {
    if (!claim) return;
    const reason = window.prompt("Enter rejection reason:");
    if (reason === null) return;
    await updateClaimStatus(claim.id, "Rejected", reason || undefined);
    navigate("/operating-claims");
  };

  if (!claim) return (
    <div className="p-6">
      <button onClick={() => navigate(-1)} className="px-3 py-2 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50 flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back</button>
      <p className="mt-4 text-amber-800">Claim not found.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 to-yellow-50/50 p-6">
      <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="px-3 py-2 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50 flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back</button>
          <div className="flex gap-2">
            <button onClick={approve} className="px-3 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 flex items-center gap-2"><CheckCircle className="w-4 h-4" />Approve</button>
            <button onClick={reject} className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 flex items-center gap-2"><XCircle className="w-4 h-4" />Reject</button>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-amber-900 mb-4">{claim.claimNumber}</h1>
        <div className="space-y-2 text-amber-800">
          <p><strong>Policy:</strong> {claim.policyName} ({claim.policyNumber})</p>
          <p><strong>Type:</strong> {claim.type}</p>
          <p><strong>Status:</strong> {claim.status}</p>
          <p><strong>Submitted:</strong> {new Date(claim.submittedOn).toLocaleDateString()}</p>
          <p><strong>Incident Date:</strong> {new Date(claim.incidentDate).toLocaleDateString()}</p>
          <p><strong>Amount Requested:</strong> ${claim.amountRequested.toLocaleString()}</p>
          {claim.amountApproved && <p><strong>Amount Approved:</strong> ${claim.amountApproved.toLocaleString()}</p>}
          <p><strong>Description:</strong> {claim.description}</p>
          {claim.attachments && claim.attachments.length > 0 && (
            <div>
              <strong>Attachments:</strong>
              <ul className="list-disc pl-6">
                {claim.attachments.map(a => <li key={a}>{a}</li>)}
              </ul>
            </div>
          )}
          {claim.notes && <p><strong>Notes:</strong> {claim.notes}</p>}
        </div>
      </div>
    </div>
  );
};

export default ClaimDetails;
