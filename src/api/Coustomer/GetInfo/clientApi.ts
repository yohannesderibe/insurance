// api/Client/clientApi.ts
import axios from "axios";

const BASE_URL = "http://localhost:5150/api";

export interface ClientProfile {
  id: string;
  firstName: string;
  fatherName: string;
  grandFatherName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phoneNumber: string;
  region: string;
  city: string;
  subCity: string;
  nationalIdOrPassport: string;
  createdAt: string;
}

export const getClientProfile = async (): Promise<ClientProfile> => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.get(`${BASE_URL}/Client/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch client profile:", error);
    throw error;
  }
};