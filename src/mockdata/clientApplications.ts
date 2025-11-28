export type ApplicationStatus = "Pending" | "Accepted" | "Rejected" | "Edited" | "AwaitingPayment";

export interface ClientApplication {
  id: string;
  customerName: string;
  submittedAt: string;
  policyType: string;
  premium: number;
  coverageAmount: number;
  notes?: string;
  status: ApplicationStatus;
  lastUpdated?: string;
}

let applications: ClientApplication[] = [
  {
    id: "app-001",
    customerName: "John Doe",
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    policyType: "Comprehensive Vehicle Insurance",
    premium: 1200,
    coverageAmount: 20000,
    status: "Pending",
    notes: "First-time customer"
  },
  {
    id: "app-002",
    customerName: "Sara Ahmed",
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    policyType: "Family Health Shield",
    premium: 900,
    coverageAmount: 15000,
    status: "Edited",
    notes: "Updated coverage requested"
  },
  {
    id: "app-003",
    customerName: "Daniel Kim",
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    policyType: "Home Protect Plus",
    premium: 700,
    coverageAmount: 50000,
    status: "Rejected",
    notes: "Missing valuation document"
  }
];

export const getMockApplications = () => applications;

export const updateMockApplicationStatus = (id: string, status: ApplicationStatus, notes?: string) => {
  const idx = applications.findIndex(a => a.id === id);
  if (idx !== -1) {
    applications[idx] = {
      ...applications[idx],
      status,
      notes: notes ?? applications[idx].notes,
      lastUpdated: new Date().toISOString()
    };
  }
};

export const editMockApplication = (id: string, updatedFields: Partial<Pick<ClientApplication, "premium" | "coverageAmount" | "notes">>) => {
  const idx = applications.findIndex(a => a.id === id);
  if (idx !== -1) {
    applications[idx] = {
      ...applications[idx],
      ...updatedFields,
      status: "Edited",
      lastUpdated: new Date().toISOString()
    };
  }
};

export type { ClientApplication };
