// src/types/claims.ts
export interface ApiClaim {
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
  trafficPoliceReportPdfUrl: string;
  status: string;
  createdAt: string;
  clientFirstName: string | null;
  clientFatherName: string | null;
  clientGrandFatherName: string | null;
  clientEmail: string | null;
}

export interface CustomerClaim {
  id: string;
  claimNumber: string;
  policyName: string;
  type: 'Motor' | 'Life' | 'Health' | 'Property' | 'General';
  status: 'Submitted' | 'In Review' | 'Approved' | 'Rejected' | 'Paid';
  submittedOn: Date;
  incidentDate: Date;
  description: string;
  amountRequested: number;
  amountApproved?: number;
  updatedOn: Date | null;
  payoutDate: Date | null;
  notes: string | null;
  evidenceImages: string[];
  policeReportUrl: string;
  location: string;
  incidentType: string;
  clientId: string;
  motorInsuranceId: string | null;
  lifeInsuranceId: string | null;
}

// For creating new claims
export interface CreateClaimDto {
  motorInsuranceApplicationId?: string;
  lifeInsuranceApplicationId?: string;
  incidentDate: string;
  incidentTime: string;
  location: string;
  incidentType: string;
  description: string;
  evidenceImages?: File[];
  trafficPoliceReport?: File;
}