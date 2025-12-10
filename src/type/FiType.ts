// src/types/finance.ts
export type ApplicationStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Edited' | 'AwaitingPayment';

export interface ClientApplication {
  id: string;
  customerName: string;
  policyType: string;
  premium: number;
  coverageAmount: number;
  submittedAt: string;
  status: ApplicationStatus;
  notes?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  licensePlate?: string;
} 