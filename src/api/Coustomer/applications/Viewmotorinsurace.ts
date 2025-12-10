// import axios from "axios";

// const API_BASE_URL = "http://localhost:5150/api/Client";

// export interface CustomerMotorApplication {
//   id: string;
//   clientId: string;
//   categoryName: string;
//   subCategoryName: string;
//   model: string;
//   registrationNumber?: string;
//   yearOfManufacture: number;
//   engineNumber?: string;
//   chassisNumber?: string;
//   marketPrice: number;
//   calculatedPremium: number;
//   status: "Pending" | "Approved" | "Rejected" | "Edited" | "AwaitingPayment";
//   createdAt: string;
//   message?: string;
// }

// const mapToCustomerMotorApplication = (app: any): CustomerMotorApplication => {
//   return {
//     id: app.applicationId,
//     clientId: app.clientId,
//     categoryName: app.categoryName,
//     subCategoryName: app.subCategoryName,
//     model: app.model,
//     registrationNumber: app.registrationNumber,
//     yearOfManufacture: app.yearOfManufacture,
//     engineNumber: app.engineNumber,
//     chassisNumber: app.chassisNumber,
//     marketPrice: app.marketPrice,
//     calculatedPremium: app.calculatedPremium,
//     status: app.status,
//     createdAt: app.createdAt,
//     message: app.message,
//   };
// };

// export const getClientMotorApplications = async (
//   clientId: string
// ): Promise<CustomerMotorApplication[]> => {
//   try {
//     const url = `${API_BASE_URL}/${clientId}/applications/motor`;
//     console.log("Fetching client motor applications:", url);
//     const response = await axios.get(url);
//     console.log("Client motor applications response status:", response.status);
//     const data = Array.isArray(response.data) ? response.data : [];
//     console.log("Client motor applications raw length:", data.length);
//     return data.map(mapToCustomerMotorApplication);
//   } catch (error: any) {
//     console.error("Failed to fetch client motor applications:", error.response?.data || error.message);
//     return [];
//   }
// };
import axios from "axios";

const API_BASE_URL = "http://localhost:5150/api/Client";

export interface CustomerMotorApplication {
  id: string;
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
  status: "Pending" | "Approved" | "Rejected" | "Edited" | "AwaitingPayment";
  createdAt: string;
  message?: string;
  carImageUrl?: string;
  carLibreImageUrl?: string;
}

const mapToCustomerMotorApplication = (app: any): CustomerMotorApplication => {
  return {
    id: app.applicationId,
    clientId: app.clientId,
    categoryName: app.categoryName,
    subCategoryName: app.subCategoryName,
    model: app.model,
    plateNumber: app.plateNumber,
    yearOfManufacture: app.yearOfManufacture,
    engineNumber: app.engineNumber,
    chassisNumber: app.chassisNumber,
    marketPrice: app.marketPrice,
    calculatedPremium: app.calculatedPremium,
    insuranceType: app.insuranceType,
    status: app.status,
    createdAt: app.createdAt,
    message: app.message,
    carImageUrl: app.carImageUrl,
    carLibreImageUrl: app.carLibreImageUrl,
  };
};

export const getClientMotorApplications = async (
  token?: string
): Promise<CustomerMotorApplication[]> => {
  try {
    const url = `${API_BASE_URL}/applications/motor`;
    console.log("Fetching client motor applications:", url);
    
    const config = {
      headers: token ? {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*'
      } : {}
    };
    
    const response = await axios.get(url, config);
    console.log("Client motor applications response status:", response.status);
    
    const data = Array.isArray(response.data) ? response.data : [];
    console.log("Client motor applications raw length:", data.length);
    
    return data.map(mapToCustomerMotorApplication);
    
  } catch (error: any) {
    console.error("Failed to fetch client motor applications:", error.response?.data || error.message);
    return [];
  }
};