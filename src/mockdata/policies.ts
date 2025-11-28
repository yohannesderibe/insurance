export interface CustomerPolicy {
  id: string;
  policyNumber: string;
  name: string;
  description: string;
  coverage: string[];
  premium: number;
  status: "Active" | "Pending Renewal" | "Lapsed";
  effectiveDate: string;
  renewalDate: string;
  nextPaymentDate: string;
  paymentStatus: "Paid" | "Due" | "Overdue";
  lastPaymentDate?: string;
  benefits?: string[];
}

export const customerPolicies: CustomerPolicy[] = [
  {
    id: "pol-001",
    policyNumber: "POL-UI-2024-0001",
    name: "Comprehensive Vehicle Insurance",
    description: "Full coverage for private vehicles including accidents, theft, and natural disasters.",
    coverage: [
      "Accident damage (up to $25,000)",
      "Third-party liability",
      "Natural disaster coverage",
      "24/7 roadside assistance"
    ],
    premium: 1250,
    status: "Active",
    effectiveDate: "2024-01-10T00:00:00.000Z",
    renewalDate: "2025-01-09T00:00:00.000Z",
    nextPaymentDate: "2024-07-10T00:00:00.000Z",
    paymentStatus: "Paid",
    lastPaymentDate: "2024-01-10T00:00:00.000Z",
    benefits: ["Worldwide coverage", "Zero depreciation for first 2 years"]
  },
  {
    id: "pol-002",
    policyNumber: "POL-HI-2023-0321",
    name: "Family Health Shield",
    description: "Comprehensive family health plan covering up to 4 family members.",
    coverage: [
      "In-patient hospitalization",
      "Day-care procedures",
      "Maternity benefits",
      "Annual health checkup"
    ],
    premium: 980,
    status: "Pending Renewal",
    effectiveDate: "2023-07-01T00:00:00.000Z",
    renewalDate: "2024-06-30T00:00:00.000Z",
    nextPaymentDate: "2024-06-15T00:00:00.000Z",
    paymentStatus: "Due",
    lastPaymentDate: "2023-07-01T00:00:00.000Z",
    benefits: ["No-claim bonus", "Cashless hospitals network"]
  },
  {
    id: "pol-003",
    policyNumber: "POL-LI-2021-1456",
    name: "Secure Life Plan",
    description: "Term insurance plan with accidental death rider.",
    coverage: [
      "Life cover up to $150,000",
      "Accidental death benefit",
      "Terminal illness cover"
    ],
    premium: 420,
    status: "Active",
    effectiveDate: "2021-03-15T00:00:00.000Z",
    renewalDate: "2031-03-14T00:00:00.000Z",
    nextPaymentDate: "2024-03-15T00:00:00.000Z",
    paymentStatus: "Overdue",
    lastPaymentDate: "2023-03-15T00:00:00.000Z",
    benefits: ["Flexible premium payment", "Tax benefits under section 80C"]
  },
  {
    id: "pol-004",
    policyNumber: "POL-HM-2022-0889",
    name: "Home Protect Plus",
    description: "Protects residential property against damage, theft, and natural calamities.",
    coverage: [
      "Building structure cover",
      "Household contents",
      "Burglary and theft",
      "Temporary accommodation"
    ],
    premium: 760,
    status: "Lapsed",
    effectiveDate: "2022-05-20T00:00:00.000Z",
    renewalDate: "2023-05-19T00:00:00.000Z",
    nextPaymentDate: "2023-05-10T00:00:00.000Z",
    paymentStatus: "Overdue",
    lastPaymentDate: "2022-05-20T00:00:00.000Z"
  }
];

export default customerPolicies;

