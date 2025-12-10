import axios from "axios";

const PAYMENT_BASE_URL = "http://localhost:5150/api/Payment";

export interface CustomerMotorApplication {
  id: string;
  clientId: string;
  categoryName: string;
  subCategoryName: string;
  model: string;
  registrationNumber?: string;
  yearOfManufacture: number;
  engineNumber?: string;
  chassisNumber?: string;
  marketPrice: number;
  calculatedPremium: number;
  status: "Pending" | "Approved" | "Rejected" | "Edited" | "AwaitingPayment";
  createdAt: string;
  message?: string;
}




export const initiatePayment = async (
  applicationId: string,
  token?: string
) => {
  try {
    const url = `${PAYMENT_BASE_URL}/initiate/${applicationId}`;
    console.log("Initiating payment:", url);
    const headers = token
      ? { Authorization: `Bearer ${token}`, Accept: "*/*" }
      : { Accept: "*/*" };
    const response = await axios.post(url, null, { headers });
    console.log("Payment initiate response status:", response.status);
    return response.data;
  } catch (error: any) {
    console.error("Failed to initiate payment:", error.response?.data || error.message);
    throw error;
  }
};

export const verifyPayment = async (
  reference: string,
  token?: string
) => {
  try {
    const url = `${PAYMENT_BASE_URL}/verify?reference=${encodeURIComponent(reference)}`;
    const headers = token
      ? { Authorization: `Bearer ${token}`, Accept: "*/*" }
      : { Accept: "*/*" };
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error: any) {
    console.error("Failed to verify payment:", error.response?.data || error.message);
    throw error;
  }
};
