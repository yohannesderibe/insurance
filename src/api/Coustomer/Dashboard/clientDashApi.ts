// src/api/Client/clientDashApi.ts

import axios from "axios";

/* -----------------------------
   Axios instance
------------------------------ */
const API = axios.create({
  baseURL: "http://localhost:5150/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/* -----------------------------
   Attach token automatically
------------------------------ */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* -----------------------------
   Types
------------------------------ */
export interface ClientDashboardResponse {
  totalApplications: number;
  approvedApplications: number;
  motorPolicies: number;
  lifePolicies: number;
  totalPaidAmount: number;
}

/* -----------------------------
   API Call
------------------------------ */
export const getClientDashboard = async (): Promise<ClientDashboardResponse> => {
  try {
    const response = await API.get<ClientDashboardResponse>(
      "/Client/client-dashboard"
    );
    return response.data;
  } catch (error: any) {
    // Network error
    if (!error.response) {
      throw new Error("Network error — please check your connection.");
    }

    // Unauthorized
    if (error.response.status === 401) {
      throw new Error("Session expired. Please login again.");
    }

    // Forbidden
    if (error.response.status === 403) {
      throw new Error("You do not have permission to access this data.");
    }

    // Server-side message
    throw new Error(
      error.response.data?.message || "Failed to load dashboard data."
    );
  }
};
