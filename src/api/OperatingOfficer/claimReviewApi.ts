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
}

/* ===== PATCH: Update claim status ===== */
export async function updateOperatorClaimStatus(
  claimId: string,
  status: "Approved" | "Rejected" | "In Review" | "Paid",
  notes?: string
) {
  await api.patch(`/Operator/claims/${claimId}/status`, {
    status,
    notes,
  });
}
