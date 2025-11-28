// src/api/Finance/financeOfficerApi.ts
import axios from "axios";

// Finance Officer API - Mock data implementation
import type { CategoryDto } from "../Admin/categoriesApi";
import type { SubCategoryDto } from "../Admin/Catagories/subCategoriesApi";
import {
  getMockCategories,
  getMockSubCategories,
  updateMockCategory,
  updateMockSubCategory,
} from "../../mockdata/financeMockData";
import {
  getMockApplications,
  updateMockApplicationStatus,
  editMockApplication,
} from "../../mockdata/clientApplications";

const BASE_URL = "http://localhost:5150/api/Finance";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================
// CATEGORIES
// ============================================

/**
 * Get all categories pending FO approval
 */
export const getPendingCategories = async (): Promise<CategoryDto[]> => {
  await delay(300);
  const categories = getMockCategories();
  return categories.filter((c) => c.status === "Pending_FO_Approval");
  
  // Uncomment when backend is ready:
  // try {
  //   const res = await axios.get(`${BASE_URL}/categories/pending`);
  //   return res.data;
  // } catch (error: any) {
  //   console.error("Failed to fetch pending categories:", error);
  //   if (error.response) console.error(error.response.data);
  //   throw error;
  // }
};

/**
 * Get all approved categories
 */
export const getApprovedCategories = async (): Promise<CategoryDto[]> => {
  await delay(300);
  const categories = getMockCategories();
  return categories.filter((c) => c.status === "Approved_By_FO");
  
  // Uncomment when backend is ready:
  // try {
  //   const res = await axios.get(`${BASE_URL}/categories/approved`);
  //   return res.data;
  // } catch (error: any) {
  //   console.error("Failed to fetch approved categories:", error);
  //   throw error;
  // }
};

/**
 * Get all rejected categories
 */
export const getRejectedCategories = async (): Promise<CategoryDto[]> => {
  await delay(300);
  const categories = getMockCategories();
  return categories.filter((c) => c.status === "Rejected_By_FO");
  
  // Uncomment when backend is ready:
  // try {
  //   const res = await axios.get(`${BASE_URL}/categories/rejected`);
  //   return res.data;
  // } catch (error: any) {
  //   console.error("Failed to fetch rejected categories:", error);
  //   throw error;
  // }
};

/**
 * Approve a category
 */
export const approveCategory = async (id: string): Promise<void> => {
  await delay(200);
  updateMockCategory(id, {
    status: "Approved_By_FO",
    approvedBy: "Current FO User",
    approvedAt: new Date().toISOString(),
  });
  
  // Uncomment when backend is ready:
  // try {
  //   await axios.post(`${BASE_URL}/categories/${id}/approve`);
  // } catch (error: any) {
  //   console.error(`Failed to approve category ${id}:`, error);
  //   if (error.response) console.error(error.response.data);
  //   throw error;
  // }
};

/**
 * Reject a category
 */
export const rejectCategory = async (id: string, reason?: string): Promise<void> => {
  await delay(200);
  updateMockCategory(id, {
    status: "Rejected_By_FO",
    rejectedReason: reason || "No reason provided",
  });
  
  // Uncomment when backend is ready:
  // try {
  //   await axios.post(`${BASE_URL}/categories/${id}/reject`, { reason });
  // } catch (error: any) {
  //   console.error(`Failed to reject category ${id}:`, error);
  //   if (error.response) console.error(error.response.data);
  //   throw error;
  // }
};

/**
 * Update category (FO can only edit allowed fields like price)
 */
export const updateCategoryByFO = async (id: string, updates: {
  pricePerYear?: number;
  [key: string]: any;
}): Promise<void> => {
  await delay(200);
  const updateData: Partial<CategoryDto> = {};
  if (updates.pricePerYear !== undefined) {
    updateData.pricePerYear = updates.pricePerYear;
  }
  updateMockCategory(id, updateData);
  
  // Uncomment when backend is ready:
  // try {
  //   const form = new FormData();
  //   if (updates.pricePerYear !== undefined) {
  //     form.append("PricePerYear", updates.pricePerYear.toString());
  //   }
  //   await axios.put(`${BASE_URL}/categories/${id}/update`, form, {
  //     headers: { "Content-Type": "multipart/form-data" },
  //   });
  // } catch (error: any) {
  //   console.error(`Failed to update category ${id}:`, error);
  //   if (error.response) console.error(error.response.data);
  //   throw error;
  // }
};

// ============================================
// SUBCATEGORIES
// ============================================

/**
 * Get all subcategories pending FO approval
 */
export const getPendingSubCategories = async (): Promise<SubCategoryDto[]> => {
  await delay(300);
  const subCategories = getMockSubCategories();
  return subCategories.filter((s) => s.status === "Pending_FO_Approval");
  
  // Uncomment when backend is ready:
  // try {
  //   const res = await axios.get(`${BASE_URL}/subcategories/pending`);
  //   return res.data;
  // } catch (error: any) {
  //   console.error("Failed to fetch pending subcategories:", error);
  //   if (error.response) console.error(error.response.data);
  //   throw error;
  // }
};

/**
 * Get all approved subcategories
 */
export const getApprovedSubCategories = async (): Promise<SubCategoryDto[]> => {
  await delay(300);
  const subCategories = getMockSubCategories();
  return subCategories.filter((s) => s.status === "Approved_By_FO");
  
  // Uncomment when backend is ready:
  // try {
  //   const res = await axios.get(`${BASE_URL}/subcategories/approved`);
  //   return res.data;
  // } catch (error: any) {
  //   console.error("Failed to fetch approved subcategories:", error);
  //   throw error;
  // }
};

/**
 * Get all rejected subcategories
 */
export const getRejectedSubCategories = async (): Promise<SubCategoryDto[]> => {
  await delay(300);
  const subCategories = getMockSubCategories();
  return subCategories.filter((s) => s.status === "Rejected_By_FO");
  
  // Uncomment when backend is ready:
  // try {
  //   const res = await axios.get(`${BASE_URL}/subcategories/rejected`);
  //   return res.data;
  // } catch (error: any) {
  //   console.error("Failed to fetch rejected subcategories:", error);
  //   throw error;
  // }
};

/**
 * Approve a subcategory
 */
export const approveSubCategory = async (id: string): Promise<void> => {
  await delay(200);
  updateMockSubCategory(id, {
    status: "Approved_By_FO",
    approvedBy: "Current FO User",
    approvedAt: new Date().toISOString(),
  });
  
  // Uncomment when backend is ready:
  // try {
  //   await axios.post(`${BASE_URL}/subcategories/${id}/approve`);
  // } catch (error: any) {
  //   console.error(`Failed to approve subcategory ${id}:`, error);
  //   if (error.response) console.error(error.response.data);
  //   throw error;
  // }
};

/**
 * Reject a subcategory
 */
export const rejectSubCategory = async (id: string, reason?: string): Promise<void> => {
  await delay(200);
  updateMockSubCategory(id, {
    status: "Rejected_By_FO",
    rejectedReason: reason || "No reason provided",
  });
  
  // Uncomment when backend is ready:
  // try {
  //   await axios.post(`${BASE_URL}/subcategories/${id}/reject`, { reason });
  // } catch (error: any) {
  //   console.error(`Failed to reject subcategory ${id}:`, error);
  //   if (error.response) console.error(error.response.data);
  //   throw error;
  // }
};

/**
 * Update subcategory (FO can only edit allowed fields like price)
 */
export const updateSubCategoryByFO = async (id: string, updates: {
  pricePerYear?: number;
  [key: string]: any;
}): Promise<void> => {
  await delay(200);
  const updateData: Partial<SubCategoryDto> = {};
  if (updates.pricePerYear !== undefined) {
    updateData.pricePerYear = updates.pricePerYear;
  }
  updateMockSubCategory(id, updateData);
  
  // Uncomment when backend is ready:
  // try {
  //   const form = new FormData();
  //   if (updates.pricePerYear !== undefined) {
  //     form.append("PricePerYear", updates.pricePerYear.toString());
  //   }
  //   await axios.put(`${BASE_URL}/subcategories/${id}/update`, form, {
  //     headers: { "Content-Type": "multipart/form-data" },
  //   });
  // } catch (error: any) {
  //   console.error(`Failed to update subcategory ${id}:`, error);
  //   if (error.response) console.error(error.response.data);
  //   throw error;
  // }
};

// ============================================
// ANALYTICS
// ============================================

export interface FinanceAnalytics {
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
  pendingCategories: number;
  pendingSubCategories: number;
  approvedCategories: number;
  approvedSubCategories: number;
  rejectedCategories: number;
  rejectedSubCategories: number;
  totalRevenueImpact?: number;
}

/**
 * Get finance analytics/summary
 */
export const getFinanceAnalytics = async (): Promise<FinanceAnalytics> => {
  await delay(300);
  const categories = getMockCategories();
  const subCategories = getMockSubCategories();
  
  const pendingCategories = categories.filter((c) => c.status === "Pending_FO_Approval").length;
  const approvedCategories = categories.filter((c) => c.status === "Approved_By_FO").length;
  const rejectedCategories = categories.filter((c) => c.status === "Rejected_By_FO").length;
  
  const pendingSubCategories = subCategories.filter((s) => s.status === "Pending_FO_Approval").length;
  const approvedSubCategories = subCategories.filter((s) => s.status === "Approved_By_FO").length;
  const rejectedSubCategories = subCategories.filter((s) => s.status === "Rejected_By_FO").length;
  
  // Calculate revenue impact from approved items
  const approvedItems = [
    ...categories.filter((c) => c.status === "Approved_By_FO"),
    ...subCategories.filter((s) => s.status === "Approved_By_FO"),
  ];
  const totalRevenueImpact = approvedItems.reduce((sum, item) => {
    return sum + (item.pricePerYear || 0);
  }, 0);
  
  return {
    totalPending: pendingCategories + pendingSubCategories,
    totalApproved: approvedCategories + approvedSubCategories,
    totalRejected: rejectedCategories + rejectedSubCategories,
    pendingCategories,
    pendingSubCategories,
    approvedCategories,
    approvedSubCategories,
    rejectedCategories,
    rejectedSubCategories,
    totalRevenueImpact,
  };
  
  // Uncomment when backend is ready:
  // try {
  //   const res = await axios.get(`${BASE_URL}/analytics`);
  //   return res.data;
  // } catch (error: any) {
  //   console.error("Failed to fetch finance analytics:", error);
  //   throw error;
  // }
};

// ============================================
// CLIENT APPLICATIONS (Customer submissions)
// ============================================

export const getApplications = async () => {
  await delay(300);
  return getMockApplications();
};

export const updateApplicationStatus = async (id: string, status: "Accepted" | "Rejected" | "AwaitingPayment", notes?: string) => {
  await delay(200);
  updateMockApplicationStatus(id, status, notes);
};

export const editApplication = async (id: string, updatedFields: { premium?: number; coverageAmount?: number; notes?: string }) => {
  await delay(200);
  editMockApplication(id, updatedFields);
};
