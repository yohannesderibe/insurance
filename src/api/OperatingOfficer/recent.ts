// api/OperatingOfficer/recent.ts
import axios from "axios";

const API_URL = "http://localhost:5150/api";

// Export as both type and value
export interface PaymentInfo {
  applicationId: string;
  reference: string | null;
  checkoutUrl: string | null;
  clientId: string;
  clientFullName: string;
  premiumAmount: number;
  paymentStatus: string;
  isPaid: boolean;
  createdAt: string;
}

export type { PaymentInfo }; // This ensures it's exported as a type

export const getRecentPayments = async (): Promise<PaymentInfo[]> => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.get(`${API_URL}/Payment/recent`, {
      headers: {
        "Accept": "*/*",
        "Authorization": `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch recent payments:", error);
    throw new Error(
      error.response?.data?.message ||
      "Failed to fetch recent payments. Please try again."
    );
  }
};

export const getPaymentDetails = async (applicationId: string): Promise<any> => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.get(`${API_URL}/Payment/application/${applicationId}`, {
      headers: {
        "Accept": "*/*",
        "Authorization": `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch payment details:", error);
    throw new Error(
      error.response?.data?.message ||
      "Failed to fetch payment details. Please try again."
    );
  }
};