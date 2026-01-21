import { customerClaims, type CustomerClaim, type ClaimStatus } from "../../mockdata/claims";

/* ===== GET: Operator claims ===== */
// Simulating fetching from backend using local mock data
export async function getOperatorClaims(): Promise<CustomerClaim[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return claims that are relevant to the Operator
  // This includes Submitted, Sentinel Back, or In Review claims
  // Also can see history of what they processed
  return [...customerClaims];
}

/* ===== PATCH: Update claim status ===== */
export async function updateOperatorClaimStatus(
  claimId: string,
  status: ClaimStatus,
  notes?: string, // Used for internal notes
  amountApproved?: number, // Used when approving
  rejectionReason?: string // Used when rejecting
) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const claimIndex = customerClaims.findIndex(c => c.id === claimId);
  if (claimIndex === -1) {
    throw new Error("Claim not found");
  }

  const claim = customerClaims[claimIndex];

  // Update fields based on action
  const updates: Partial<CustomerClaim> = {
    status,
    updatedOn: new Date().toISOString(),
    operatorActionDate: new Date().toISOString(),
  };

  if (notes) {
    updates.notes = notes;
  }

  if (status === "OperatorApproved" && amountApproved !== undefined) {
    updates.amountApproved = amountApproved;
  }

  if (status === "OperatorRejected" && rejectionReason) {
    updates.rejectionReason = rejectionReason;
  }

  // If moving from SentBack to Submitted/InReview, we might want to clear previous manager feedback?
  // For now, we keep history.

  customerClaims[claimIndex] = { ...claim, ...updates };
}

// Export specific DTO if needed for other parts, but we are using CustomerClaim primarily now
export interface OperatorClaimDto {
  // ... keep existing if needed for type compatibility elsewhere, 
  // but for this task we are switching to CustomerClaim
  [key: string]: any;
}
