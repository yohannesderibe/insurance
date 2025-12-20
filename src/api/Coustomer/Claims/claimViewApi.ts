import api from "../../axios";

export type ClaimType = "Motor" | "Life" | "Unknown";

export interface ClaimViewDto {
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

  clientFirstName: string | null;
  clientFatherName: string | null;
  clientGrandFatherName: string | null;
  clientEmail: string | null;
}

/**
 * Fetch all claims for the logged-in client
 */
export async function getClientClaims(): Promise<ClaimViewDto[]> {
  const response = await api.get<ClaimViewDto[]>(
    `/Client/claims`
  );
  return response.data;
}

/**
 * Infer claim type dynamically
 */
export function resolveClaimType(claim: ClaimViewDto): ClaimType {
  if (claim.motorInsuranceApplicationId) return "Motor";
  if (claim.lifeInsuranceApplicationId) return "Life";
  return "Unknown";
}
