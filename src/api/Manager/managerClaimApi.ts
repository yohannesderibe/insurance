import { customerClaims, type CustomerClaim, type ClaimStatus } from "../../mockdata/claims";

/* ===== GET: Manager claims ===== */
// Fetch claims that need Manager attention
export async function getManagerClaims(): Promise<CustomerClaim[]> {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Manager sees claims that are:
    // - OperatorApproved (Manager needs to Approve or Reject)
    // - OperatorRejected (Manager needs to Agree or Disagree)
    // - ManagerApproved/ManagerRejected (History)
    return customerClaims.filter(c =>
        ["OperatorApproved", "OperatorRejected", "ManagerApproved", "ManagerRejected", "SentBack"].includes(c.status)
    );
}

/* ===== PATCH: Update claim status ===== */
export async function updateManagerClaimStatus(
    claimId: string,
    action: "Approve" | "Reject" | "SendBack",
    feedback?: string // For SendBack or Rejection reason
) {
    await new Promise(resolve => setTimeout(resolve, 300));

    const claimIndex = customerClaims.findIndex(c => c.id === claimId);
    if (claimIndex === -1) {
        throw new Error("Claim not found");
    }

    const claim = customerClaims[claimIndex];

    // Logic for state transitions
    let newStatus: ClaimStatus = claim.status;

    if (action === "Approve") {
        // If Operator Approved -> Manager Approves -> Final Approved
        if (claim.status === "OperatorApproved") {
            newStatus = "Approved"; // or "ManagerApproved" -> then payment system picks it up
            // "Approved" seems to be the final state in the original system
        }
        // If Operator Rejected -> Manager Agrees (Approve Rejection) -> Final Rejected
        else if (claim.status === "OperatorRejected") {
            newStatus = "Rejected"; // Final rejection
        }
    }
    else if (action === "Reject") {
        // If Operator Approved -> Manager Rejects -> Sent Back
        // Wait, the requirement says " Manager Rejects -> Send Back to Operator"
        if (claim.status === "OperatorApproved") {
            newStatus = "SentBack";
        }
    }
    else if (action === "SendBack") {
        // Explicit Send Back (Disagree with Operator Rejection)
        if (claim.status === "OperatorRejected") {
            newStatus = "SentBack";
        }
    }

    // Update fields
    const updates: Partial<CustomerClaim> = {
        status: newStatus,
        updatedOn: new Date().toISOString(),
        managerActionDate: new Date().toISOString(),
    };

    if (feedback) {
        updates.managerFeedback = feedback;
    }

    customerClaims[claimIndex] = { ...claim, ...updates };
}
