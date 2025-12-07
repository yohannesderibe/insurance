// import axios from "../../../api/axios";

// const API_URL = "http://localhost:5150/api";

// // Define interfaces based on what the API returns
// export interface Application {
//   applicationId: string;
//   clientId: string;
//   categoryName: string;
//   subCategoryName: string;
//   model: string;
//   plateNumber: string;
//   yearOfManufacture: number;
//   engineNumber: string;
//   chassisNumber: string;
//   marketPrice: number;
//   calculatedPremium: number;
//   insuranceType: string;
//   status: string;
//   createdAt: string;
//   message: string;
//   clientFullName: string;
//   clientEmail: string;
//   clientPhoneNumber: string;
//   clientGender: string;
//   clientDateOfBirth: string;
//   clientNationalIdOrPassport: string;
//   clientPassportOrNationalIdImageUrl: string;
//   carImageUrl: string;
//   carLibreImageUrl: string;
// }

// // For component compatibility, keep Policy interface
// export interface Policy {
//   id: string;
//   policyNumber: string;
//   name: string;
//   description: string;
//   status: "Active" | "Pending Renewal" | "Lapsed" | "Pending" | "Approved" | "Cancelled";
//   paymentStatus: "Paid" | "Overdue" | "Pending" | "Current" | "Unpaid";
//   renewalDate: string;
//   nextPaymentDate: string;
//   premium: number;
//   coverage: string[];
//   benefits?: string[];
//   effectiveDate: string;
//   applicationDate?: string;
//   paidDate?: string;
// }

// // Get authentication token
// const getAuthToken = (): string => {
//   return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';
// };

// // Configure axios instance
// const apiClient = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   }
// });

// // Add request interceptor to include token
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = getAuthToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Map API application to Policy interface
// const mapApplicationToPolicy = (app: Application): Policy => {
//   // Generate a policy number if not available from API
//   const policyNumber = `POL-${app.applicationId.substring(0, 8).toUpperCase()}`;
  
//   return {
//     id: app.applicationId,
//     policyNumber: policyNumber,
//     name: `${app.model} ${app.insuranceType} Insurance`,
//     description: `${app.model} (${app.yearOfManufacture}) - ${app.plateNumber} - ${app.insuranceType}`,
//     status: app.status === "Approved" ? "Active" : app.status as any,
//     paymentStatus: "Paid", // Since this is from paid applications endpoint
//     renewalDate: new Date(new Date(app.createdAt).setFullYear(new Date(app.createdAt).getFullYear() + 1)).toISOString(),
//     nextPaymentDate: new Date(new Date(app.createdAt).setFullYear(new Date(app.createdAt).getFullYear() + 1)).toISOString(),
//     premium: app.calculatedPremium,
//     coverage: [
//       `${app.insuranceType} Coverage`,
//       `Market Value: $${app.marketPrice.toLocaleString()}`,
//       `Vehicle: ${app.model} ${app.yearOfManufacture}`
//     ],
//     benefits: [
//       "24/7 Roadside Assistance",
//       "Comprehensive Coverage",
//       "Quick Claim Processing"
//     ],
//     effectiveDate: app.createdAt,
//     applicationDate: app.createdAt,
//     paidDate: app.createdAt
//   };
// };

// // Get paid applications (new endpoint)
// export const getPaidApplications = async (): Promise<Policy[]> => {
//   try {
//     const response = await apiClient.get<Application[]>('/Client/applications/paid');
    
//     // Map the API response to the Policy interface
//     const policies = response.data.map(mapApplicationToPolicy);
    
//     return policies;
//   } catch (error: any) {
//     // Handle 404 specifically - return empty array since no paid applications exist
//     if (error.response?.status === 404) {
//       return [];
//     }
//     console.error("Failed to load paid applications:", error);
//     throw error;
//   }
// };

// // Get all policies (existing endpoint)
// export const getCustomerPolicies = async (): Promise<Policy[]> => {
//   try {
//     const response = await apiClient.get<Policy[]>('/Customer/policies');
//     return response.data;
//   } catch (error) {
//     console.error("Failed to load policies:", error);
//     throw error;
//   }
// };

// // Get application details
// export const getApplicationDetails = async (applicationId: string): Promise<Policy> => {
//   try {
//     const response = await apiClient.get<Application>(`/Client/applications/${applicationId}`);
//     return mapApplicationToPolicy(response.data);
//   } catch (error) {
//     console.error("Failed to load application details:", error);
//     throw error;
//   }
// };


import axios from "../../../api/axios";

const API_URL = "http://localhost:5150/api";

// Define interfaces based on what the API returns
export interface Application {
  applicationId: string;
  clientId: string;
  categoryName: string;
  subCategoryName: string;
  model: string;
  plateNumber: string;
  yearOfManufacture: number;
  engineNumber: string;
  chassisNumber: string;
  marketPrice: number;
  calculatedPremium: number;
  insuranceType: string;
  status: string;
  createdAt: string;
  message: string;
  clientFullName: string;
  clientEmail: string;
  clientPhoneNumber: string;
  clientGender: string;
  clientDateOfBirth: string;
  clientNationalIdOrPassport: string;
  clientPassportOrNationalIdImageUrl: string;
  carImageUrl: string;
  carLibreImageUrl: string;
}

// For component compatibility, keep Policy interface
export interface Policy {
  id: string;
  policyNumber: string;
  name: string;
  description: string;
  status: "Active" | "Pending Renewal" | "Lapsed" | "Pending" | "Approved" | "Cancelled";
  paymentStatus: "Paid" | "Overdue" | "Pending" | "Current" | "Unpaid";
  renewalDate: string;
  nextPaymentDate: string;
  premium: number;
  coverage: string[];
  benefits?: string[];
  effectiveDate: string;
  applicationDate?: string;
  paidDate?: string;
  // Add raw application data for full view
  rawApplication?: Application;
}

// Get authentication token
const getAuthToken = (): string => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';
};

// Configure axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add request interceptor to include token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Map API application to Policy interface
const mapApplicationToPolicy = (app: Application): Policy => {
  // Generate a policy number if not available from API
  const policyNumber = `POL-${app.applicationId.substring(0, 8).toUpperCase()}`;
  
  return {
    id: app.applicationId,
    policyNumber: policyNumber,
    name: `${app.model} ${app.insuranceType} Insurance`,
    description: `${app.model} (${app.yearOfManufacture}) - ${app.plateNumber} - ${app.insuranceType}`,
    status: app.status === "Approved" ? "Active" : app.status as any,
    paymentStatus: "Paid", // Since this is from paid applications endpoint
    renewalDate: new Date(new Date(app.createdAt).setFullYear(new Date(app.createdAt).getFullYear() + 1)).toISOString(),
    nextPaymentDate: new Date(new Date(app.createdAt).setFullYear(new Date(app.createdAt).getFullYear() + 1)).toISOString(),
    premium: app.calculatedPremium,
    coverage: [
      `${app.insuranceType} Coverage`,
      `Market Value: $${app.marketPrice.toLocaleString()}`,
      `Vehicle: ${app.model} ${app.yearOfManufacture}`
    ],
    benefits: [
      "24/7 Roadside Assistance",
      "Comprehensive Coverage",
      "Quick Claim Processing"
    ],
    effectiveDate: app.createdAt,
    applicationDate: app.createdAt,
    paidDate: app.createdAt,
    // Store the raw application data
    rawApplication: app
  };
};

// Get paid applications (new endpoint)
export const getPaidApplications = async (): Promise<Policy[]> => {
  try {
    const response = await apiClient.get<Application[]>('/Client/applications/paid');
    
    // Map the API response to the Policy interface
    const policies = response.data.map(mapApplicationToPolicy);
    
    return policies;
  } catch (error: any) {
    // Handle 404 specifically - return empty array since no paid applications exist
    if (error.response?.status === 404) {
      return [];
    }
    console.error("Failed to load paid applications:", error);
    throw error;
  }
};

// Get all policies (existing endpoint)
export const getCustomerPolicies = async (): Promise<Policy[]> => {
  try {
    const response = await apiClient.get<Policy[]>('/Customer/policies');
    return response.data;
  } catch (error) {
    console.error("Failed to load policies:", error);
    throw error;
  }
};

// Get application details
export const getApplicationDetails = async (applicationId: string): Promise<Policy> => {
  try {
    const response = await apiClient.get<Application>(`/Client/applications/${applicationId}`);
    return mapApplicationToPolicy(response.data);
  } catch (error) {
    console.error("Failed to load application details:", error);
    throw error;
  }
};