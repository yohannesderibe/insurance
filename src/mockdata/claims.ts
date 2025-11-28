export type ClaimStatus = "Submitted" | "In Review" | "Approved" | "Rejected" | "Paid";

export interface CustomerClaim {
  id: string;
  claimNumber: string;
  policyNumber: string;
  policyName: string;
  type: string;
  status: ClaimStatus;
  submittedOn: string;
  updatedOn?: string;
  incidentDate: string;
  amountRequested: number;
  amountApproved?: number;
  payoutDate?: string;
  description: string;
  adjuster?: string;
  notes?: string;
  attachments?: string[];
}

export const customerClaims: CustomerClaim[] = [
  {
    id: "clm-001",
    claimNumber: "CLM/2024/000134",
    policyNumber: "POL-UI-2024-0001",
    policyName: "Comprehensive Vehicle Insurance",
    type: "Accident Damage",
    status: "In Review",
    submittedOn: "2024-05-12T00:00:00.000Z",
    updatedOn: "2024-05-18T00:00:00.000Z",
    incidentDate: "2024-05-08T00:00:00.000Z",
    amountRequested: 6200,
    description: "Front bumper and left headlight damage after minor collision.",
    adjuster: "Sarah Thompson",
    notes: "Inspection scheduled for 20 May 2024.",
    attachments: ["accident_report.pdf", "garage_estimate.pdf"]
  },
  {
    id: "clm-002",
    claimNumber: "CLM/2024/000078",
    policyNumber: "POL-HI-2023-0321",
    policyName: "Family Health Shield",
    type: "Hospitalization",
    status: "Approved",
    submittedOn: "2024-03-02T00:00:00.000Z",
    updatedOn: "2024-03-10T00:00:00.000Z",
    incidentDate: "2024-02-25T00:00:00.000Z",
    amountRequested: 3200,
    amountApproved: 3100,
    payoutDate: "2024-03-15T00:00:00.000Z",
    description: "Appendix removal surgery for insured member.",
    adjuster: "Michael Lee",
    notes: "Claim processed under cashless facility.",
    attachments: ["hospital_bill.pdf", "doctor_summary.pdf"]
  },
  {
    id: "clm-003",
    claimNumber: "CLM/2023/000542",
    policyNumber: "POL-LI-2021-1456",
    policyName: "Secure Life Plan",
    type: "Benefit Withdrawal",
    status: "Paid",
    submittedOn: "2023-11-18T00:00:00.000Z",
    updatedOn: "2023-12-05T00:00:00.000Z",
    incidentDate: "2023-11-10T00:00:00.000Z",
    amountRequested: 15000,
    amountApproved: 15000,
    payoutDate: "2023-12-08T00:00:00.000Z",
    description: "Partial payout requested for education expenses.",
    adjuster: "Olivia Carter",
    notes: "All documents verified."
  },
  {
    id: "clm-004",
    claimNumber: "CLM/2024/000201",
    policyNumber: "POL-HM-2022-0889",
    policyName: "Home Protect Plus",
    type: "Property Damage",
    status: "Rejected",
    submittedOn: "2024-02-14T00:00:00.000Z",
    updatedOn: "2024-02-28T00:00:00.000Z",
    incidentDate: "2024-02-05T00:00:00.000Z",
    amountRequested: 4800,
    description: "Water leakage damage to kitchen ceiling.",
    adjuster: "Daniel Foster",
    notes: "Claim rejected due to policy lapse at the time of incident."
  }
];

export default customerClaims;

