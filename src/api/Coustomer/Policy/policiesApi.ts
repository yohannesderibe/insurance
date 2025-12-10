import axios from "../../../api/axios";

const API_URL = "http://localhost:5150/api";

// Define interfaces for different application types
export interface MotorApplication {
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

export interface LifeApplication {
  applicationId: string;
  clientId: string;
  categoryName: string;
  subCategoryName: string;
  age: number;
  height: number;
  weight: number;
  lifePrice: number;
  lifeInsuranceType: string;
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
}

// Union type for all applications
export type Application = MotorApplication | LifeApplication;

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
  category: 'MOTOR' | 'LIFE'; // Add category field
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

// Helper function to check if application is Motor type
const isMotorApplication = (app: Application): app is MotorApplication => {
  return 'model' in app && 'plateNumber' in app;
};

// Helper function to check if application is Life type
const isLifeApplication = (app: Application): app is LifeApplication => {
  return 'age' in app && 'lifePrice' in app;
};

// Export the type guard functions if needed in components
export { isMotorApplication, isLifeApplication };

// Map Motor application to Policy interface
const mapMotorApplicationToPolicy = (app: MotorApplication): Policy => {
  const policyNumber = `MOT-${app.applicationId.substring(0, 8).toUpperCase()}`;
  
  return {
    id: app.applicationId,
    policyNumber: policyNumber,
    name: `${app.model} ${app.insuranceType} Insurance`,
    description: `${app.model} (${app.yearOfManufacture}) - ${app.plateNumber} - ${app.insuranceType}`,
    status: app.status === "Approved" ? "Active" : app.status as any,
    paymentStatus: "Paid",
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
    category: 'MOTOR',
    rawApplication: app
  };
};

// Map Life application to Policy interface
const mapLifeApplicationToPolicy = (app: LifeApplication): Policy => {
  const policyNumber = `LIFE-${app.applicationId.substring(0, 8).toUpperCase()}`;
  
  return {
    id: app.applicationId,
    policyNumber: policyNumber,
    name: `${app.lifeInsuranceType} Life Insurance`,
    description: `${app.lifeInsuranceType} Coverage - Age: ${app.age}, Height: ${app.height}cm, Weight: ${app.weight}kg`,
    status: app.status === "Approved" ? "Active" : app.status as any,
    paymentStatus: "Paid",
    renewalDate: new Date(new Date(app.createdAt).setFullYear(new Date(app.createdAt).getFullYear() + 1)).toISOString(),
    nextPaymentDate: new Date(new Date(app.createdAt).setFullYear(new Date(app.createdAt).getFullYear() + 1)).toISOString(),
    premium: app.lifePrice,
    coverage: [
      `${app.lifeInsuranceType} Life Coverage`,
      `Age: ${app.age} years`,
      `Health Metrics: ${app.height}cm / ${app.weight}kg`,
      `Sub Category: ${app.subCategoryName}`
    ],
    benefits: [
      "24/7 Support",
      "Family Coverage Options",
      "Quick Claim Processing"
    ],
    effectiveDate: app.createdAt,
    applicationDate: app.createdAt,
    paidDate: app.createdAt,
    category: 'LIFE',
    rawApplication: app
  };
};

// Map any application to Policy interface
const mapApplicationToPolicy = (app: Application): Policy => {
  if (isMotorApplication(app)) {
    return mapMotorApplicationToPolicy(app);
  } else if (isLifeApplication(app)) {
    return mapLifeApplicationToPolicy(app);
  } else {
    // Fallback for unknown types
    const policyNumber = `POL-${(app as any).applicationId?.substring(0, 8).toUpperCase() || 'UNKNOWN'}`;
    return {
      id: (app as any).applicationId || 'unknown',
      policyNumber: policyNumber,
      name: `${(app as any).categoryName || 'Unknown'} Insurance`,
      description: 'Unknown application type',
      status: (app as any).status === "Approved" ? "Active" : "Pending",
      paymentStatus: "Paid",
      renewalDate: new Date().toISOString(),
      nextPaymentDate: new Date().toISOString(),
      premium: 0,
      coverage: [],
      effectiveDate: new Date().toISOString(),
      category: 'MOTOR', // Default
      rawApplication: app
    };
  }
};

// Get all paid applications (combine motor and life)
export const getPaidApplications = async (): Promise<Policy[]> => {
  try {
    const [motorApps, lifeApps] = await Promise.all([
      apiClient.get<MotorApplication[]>('/Client/applications/Motorpaid').catch((error) => {
        console.warn("Motor paid applications endpoint failed:", error);
        return { data: [] };
      }),
      apiClient.get<LifeApplication[]>('/Client/applications/Lifepaid').catch((error) => {
        console.warn("Life paid applications endpoint failed:", error);
        return { data: [] };
      })
    ]);

    const motorPolicies = motorApps.data.map(mapApplicationToPolicy);
    const lifePolicies = lifeApps.data.map(mapApplicationToPolicy);
    
    return [...motorPolicies, ...lifePolicies];
  } catch (error: any) {
    console.error("Failed to load paid applications:", error);
    // Try to load what we can
    try {
      const motorResponse = await apiClient.get<MotorApplication[]>('/Client/applications/Motorpaid').catch(() => ({ data: [] }));
      const motorPolicies = (motorResponse.data || []).map(mapApplicationToPolicy);
      return motorPolicies;
    } catch {
      return [];
    }
  }
};

// Get motor paid applications only
export const getMotorPaidApplications = async (): Promise<Policy[]> => {
  try {
    const response = await apiClient.get<MotorApplication[]>('/Client/applications/Motorpaid');
    return response.data.map(mapApplicationToPolicy);
  } catch (error: any) {
    if (error.response?.status === 404) {
      return [];
    }
    console.error("Failed to load motor applications:", error);
    throw error;
  }
};

// Get life paid applications only
export const getLifePaidApplications = async (): Promise<Policy[]> => {
  try {
    const response = await apiClient.get<LifeApplication[]>('/Client/applications/Lifepaid');
    return response.data.map(mapApplicationToPolicy);
  } catch (error: any) {
    if (error.response?.status === 404) {
      return [];
    }
    console.error("Failed to load life applications:", error);
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