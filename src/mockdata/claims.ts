export type ClaimStatus = "Submitted" | "In Review" | "OperatorApproved" | "OperatorRejected" | "ManagerApproved" | "ManagerRejected" | "SentBack" | "Paid" | "Approved" | "Rejected" | "Pending";

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

  // New workflow fields
  operatorActionDate?: string;
  managerActionDate?: string;
  rejectionReason?: string; // Reason from Operator or Manager
  managerFeedback?: string; // Feedback from Manager to Operator when sending back
}

export const customerClaims: CustomerClaim[] = [
  // 1. Submitted Claims (For Operator to review)
  {
    id: "clm-001",
    claimNumber: "CLM/2024/000101",
    policyNumber: "POL-MV-2024-001",
    policyName: "Comprehensive Vehicle Insurance",
    type: "Accident Damage",
    status: "Submitted",
    submittedOn: "2024-05-15T10:00:00.000Z",
    incidentDate: "2024-05-14T08:30:00.000Z",
    amountRequested: 2500,
    description: "Rear bumper damage from low speed collision at traffic light.",
    attachments: ["scene_photo_1.jpg", "scene_photo_2.jpg"]
  },
  {
    id: "clm-002",
    claimNumber: "CLM/2024/000102",
    policyNumber: "POL-HM-2023-089",
    policyName: "Home Protect Plus",
    type: "Property Damage",
    status: "Submitted",
    submittedOn: "2024-05-14T14:20:00.000Z",
    incidentDate: "2024-05-12T20:00:00.000Z",
    amountRequested: 1200,
    description: "Broken window due to storm debris.",
    attachments: ["window_damage.jpg", "repair_quote.pdf"]
  },

  // 2. In Review (Operator working on it)
  {
    id: "clm-003",
    claimNumber: "CLM/2024/000103",
    policyNumber: "POL-LF-2020-055",
    policyName: "Life Secure Plan",
    type: "Hospitalization",
    status: "In Review",
    submittedOn: "2024-05-10T09:00:00.000Z",
    updatedOn: "2024-05-12T11:00:00.000Z",
    incidentDate: "2024-05-01T10:00:00.000Z",
    amountRequested: 5000,
    description: "Emergency appendectomy.",
    adjuster: "Sarah Operator",
    notes: "Waiting for hospital discharge summary.",
    attachments: ["admission_form.pdf"]
  },

  // 3. Operator Approved (Waiting for Manager)
  {
    id: "clm-004",
    claimNumber: "CLM/2024/000104",
    policyNumber: "POL-MV-2024-002",
    policyName: "Motor Basic",
    type: "Accident Damage",
    status: "OperatorApproved",
    submittedOn: "2024-05-05T08:00:00.000Z",
    updatedOn: "2024-05-06T15:30:00.000Z",
    incidentDate: "2024-05-04T12:00:00.000Z",
    amountRequested: 800,
    amountApproved: 750,
    operatorActionDate: "2024-05-06T15:30:00.000Z",
    description: "Side mirror broken in parking lot.",
    notes: "Approved $750 based on market rate for replacement parts.",
    attachments: ["mirror_photo.jpg", "invoice.pdf"]
  },
  {
    id: "clm-005",
    claimNumber: "CLM/2024/000105",
    policyNumber: "POL-HM-2022-101",
    policyName: "Home Content",
    type: "Theft",
    status: "OperatorApproved",
    submittedOn: "2024-05-08T11:00:00.000Z",
    updatedOn: "2024-05-09T14:00:00.000Z",
    incidentDate: "2024-05-07T22:00:00.000Z",
    amountRequested: 3500,
    amountApproved: 3500,
    operatorActionDate: "2024-05-09T14:00:00.000Z",
    description: "Laptop and camera stolen during break-in.",
    notes: "Police report verified. Full amount recommended.",
    attachments: ["police_report.pdf", "receipts.pdf"]
  },

  // 4. Operator Rejected (Waiting for Manager to Confirm Rejection)
  {
    id: "clm-006",
    claimNumber: "CLM/2024/000106",
    policyNumber: "POL-TR-2024-001",
    policyName: "Travel Shield",
    type: "Trip Cancellation",
    status: "OperatorRejected",
    submittedOn: "2024-05-12T16:00:00.000Z",
    updatedOn: "2024-05-13T10:00:00.000Z",
    incidentDate: "2024-05-11T09:00:00.000Z",
    amountRequested: 1000,
    operatorActionDate: "2024-05-13T10:00:00.000Z",
    description: "Missed flight due to traffic.",
    rejectionReason: "Policy does not cover delays caused by traffic congestion, only mechanical failure or weather.",
    notes: "Reason clearly stated in section 4.2 of policy wording.",
    attachments: ["ticket.pdf"]
  },

  // 5. Sent Back (Returned by Manager to Operator)
  {
    id: "clm-007",
    claimNumber: "CLM/2024/000107",
    policyNumber: "POL-MV-2023-555",
    policyName: "Comprehensive Vehicle Insurance",
    type: "Accident Damage",
    status: "SentBack",
    submittedOn: "2024-05-01T10:00:00.000Z",
    updatedOn: "2024-05-05T16:00:00.000Z",
    incidentDate: "2024-04-28T14:00:00.000Z",
    amountRequested: 4000,
    amountApproved: 4000,
    operatorActionDate: "2024-05-02T10:00:00.000Z",
    managerActionDate: "2024-05-05T16:00:00.000Z",
    description: "Major collision damage to front end.",
    managerFeedback: "Please double check the labor costs, they look unusually high compared to approved garage rates.",
    notes: "Initial approval for full amount.",
    attachments: ["estimate_high.pdf"]
  },

  // 6. Finalized (Approved/Rejected/Paid)
  {
    id: "clm-008",
    claimNumber: "CLM/2024/000050",
    policyNumber: "POL-HM-2021-001",
    policyName: "Home Protect",
    type: "Water Damage",
    status: "Approved",
    submittedOn: "2024-03-01T00:00:00.000Z",
    updatedOn: "2024-03-05T00:00:00.000Z",
    incidentDate: "2024-02-28T00:00:00.000Z",
    amountRequested: 1500,
    amountApproved: 1500,
    description: "Pipe burst in basement.",
    notes: "Manager approved.",
    attachments: ["repair_bill.pdf"]
  },
  {
    id: "clm-009",
    claimNumber: "CLM/2024/000045",
    policyNumber: "POL-MV-2022-888",
    policyName: "Motor Insurance",
    type: "Accident",
    status: "Rejected",
    submittedOn: "2024-02-15T00:00:00.000Z",
    updatedOn: "2024-02-20T00:00:00.000Z",
    incidentDate: "2024-02-10T00:00:00.000Z",
    amountRequested: 500,
    description: "Scratch on door.",
    rejectionReason: "Damage below deductible amount.",
    notes: "Deductible is $1000.",
    attachments: ["photo.jpg"]
  },
  {
    id: "clm-010",
    claimNumber: "CLM/2023/999999",
    policyNumber: "POL-LF-2019-001",
    policyName: "Life Insurance",
    type: "Death Benefit",
    status: "Paid",
    submittedOn: "2023-12-01T00:00:00.000Z",
    updatedOn: "2023-12-15T00:00:00.000Z",
    incidentDate: "2023-11-20T00:00:00.000Z",
    amountRequested: 50000,
    amountApproved: 50000,
    payoutDate: "2023-12-20T00:00:00.000Z",
    description: "Claim for policy holder death.",
    notes: "Paid to beneficiary.",
    attachments: ["death_certificate.pdf"]
  }
];

export default customerClaims;
