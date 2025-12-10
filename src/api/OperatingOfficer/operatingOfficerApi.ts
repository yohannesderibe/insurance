import { customerClaims, type CustomerClaim } from "../../mockdata/claims";

export const getClaims = async (): Promise<CustomerClaim[]> => {
  await new Promise(res => setTimeout(res, 300));
  return customerClaims;
};

export const updateClaimStatus = async (id: string, status: "Approved" | "Rejected" | "In Review", notes?: string): Promise<void> => {
  await new Promise(res => setTimeout(res, 200));
  const idx = customerClaims.findIndex(c => c.id === id);
  if (idx !== -1) {
    customerClaims[idx] = {
      ...customerClaims[idx],
      status,
      notes: notes ?? customerClaims[idx].notes,
      updatedOn: new Date().toISOString()
    };
  }
};
