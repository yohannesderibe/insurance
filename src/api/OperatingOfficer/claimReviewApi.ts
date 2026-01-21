<<<<<<< HEAD
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
=======
import api from "../axios";

/* ===== Backend DTO ===== */
export interface OperatorClaimDto {
  claimId: string;
  clientId: string;

  motorInsuranceApplicationId: string | null;
  lifeInsuranceApplicationId: string | null;

  incidentDate: string;
  incidentTime: string;
  location: string;
  incidentType: string;
  description: string;

  evidenceImageUrls: string[];
  trafficPoliceReportPdfUrl: string | null;

  status: "Pending" | "Approved" | "Rejected" | "Paid" | string;
  createdAt: string;

  clientFirstName: string;
  clientFatherName: string;
  clientGrandFatherName: string;
  clientEmail: string;
}

/* ===== UI Model (existing expectation) ===== */
export interface CustomerClaim {
  id: string;
  claimNumber: string;
  policyName: string;
  policyNumber?: string;
  type: "Motor" | "Life";
  submittedOn: string;
  incidentDate: string;
  amountRequested: number;
  amountApproved?: number;
  status: string;
  description: string;
  attachments?: string[];
  notes?: string;
}

/* ===== Helpers ===== */
function resolveClaimType(c: OperatorClaimDto): "Motor" | "Life" {
  return c.motorInsuranceApplicationId ? "Motor" : "Life";
}

/* ===== GET: Operator claims ===== */
export async function getOperatorClaims(): Promise<CustomerClaim[]> {
  const { data } = await api.get<OperatorClaimDto[]>("/Operator/claims");

  return data.map((c) => ({
    id: c.claimId,
    claimNumber: c.claimId.slice(0, 8).toUpperCase(),
    policyName: c.motorInsuranceApplicationId
      ? "Motor Insurance"
      : "Life Insurance",
    policyNumber:
      c.motorInsuranceApplicationId ??
      c.lifeInsuranceApplicationId ??
      undefined,

    type: resolveClaimType(c),
    submittedOn: c.createdAt,
    incidentDate: c.incidentDate,

    amountRequested: 0, // backend will provide later
    status: c.status === "Pending" ? "Submitted" : c.status,

    description: c.description,
    attachments: [
      ...c.evidenceImageUrls,
      ...(c.trafficPoliceReportPdfUrl
        ? [c.trafficPoliceReportPdfUrl]
        : []),
    ],
  }));
>>>>>>> 4617ce1e41f87b5983b6b63ef14dda98db37bdc3
}

/* ===== PATCH: Update claim status ===== */
export async function updateOperatorClaimStatus(
  claimId: string,
<<<<<<< HEAD
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
=======
  status: "Approved" | "Rejected" | "In Review" | "Paid",
  notes?: string
) {
  await api.patch(`/Operator/claims/${claimId}/status`, {
    status,
    notes,
  });
>>>>>>> 4617ce1e41f87b5983b6b63ef14dda98db37bdc3
}
