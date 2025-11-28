// Mock data for Finance Officer workflow
import type { CategoryDto } from "../api/Admin/categoriesApi";
import type { SubCategoryDto } from "../api/Admin/Catagories/subCategoriesApi";

// Mock storage to simulate backend state
let mockCategories: CategoryDto[] = [
  {
    id: "cat-1",
    name: "Vehicle Insurance",
    description: "Protects your car or motorbike from accidents and damages",
    pricePerYear: 5000,
    isActive: true,
    status: "Approved_By_FO", // Categories are auto-approved
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: "admin-1",
  },
  {
    id: "cat-2",
    name: "Health Insurance",
    description: "Covers medical expenses and emergencies",
    pricePerYear: 3000,
    isActive: true,
    status: "Approved_By_FO", // Categories are auto-approved
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: "admin-1",
  },
  {
    id: "cat-3",
    name: "Property Insurance",
    description: "Protects houses and offices from damages",
    pricePerYear: 4500,
    isActive: true,
    status: "Approved_By_FO", // Categories are auto-approved
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: "admin-1",
  },
  {
    id: "cat-4",
    name: "Life Insurance",
    description: "Financial protection for your loved ones",
    pricePerYear: 2500,
    isActive: true,
    status: "Approved_By_FO", // Categories are auto-approved
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: "admin-2",
  },
];

let mockSubCategories: SubCategoryDto[] = [
  {
    id: "sub-1",
    name: "Comprehensive Car Insurance",
    description: "Full coverage for all types of vehicle damages",
    pricePerYear: 6000,
    parentId: "cat-1",
    isActive: true,
    status: "Pending_FO_Approval",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: "admin-1",
  },
  {
    id: "sub-2",
    name: "Third-Party Car Insurance",
    description: "Basic coverage for third-party damages",
    pricePerYear: 2000,
    parentId: "cat-1",
    isActive: true,
    status: "Approved_By_FO",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: "admin-1",
    approvedBy: "fo-1",
    approvedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sub-3",
    name: "Family Health Plan",
    description: "Comprehensive health coverage for entire family",
    pricePerYear: 4000,
    parentId: "cat-2",
    isActive: true,
    status: "Approved_By_FO",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: "admin-1",
    approvedBy: "fo-1",
    approvedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sub-4",
    name: "Individual Health Plan",
    description: "Health insurance for single person",
    pricePerYear: 1500,
    parentId: "cat-2",
    isActive: true,
    status: "Rejected_By_FO",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: "admin-2",
    rejectedReason: "Base price seems too low. Please verify coverage details match the pricing.",
  },
  {
    id: "sub-5",
    name: "Home Insurance",
    description: "Protection for residential properties",
    pricePerYear: 3500,
    parentId: "cat-3",
    isActive: true,
    status: "Pending_FO_Approval",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: "admin-1",
  },
];

// Simulate delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getMockCategories = () => mockCategories;
export const getMockSubCategories = () => mockSubCategories;

export const updateMockCategory = (id: string, updates: Partial<CategoryDto>) => {
  const index = mockCategories.findIndex((c) => c.id === id);
  if (index !== -1) {
    mockCategories[index] = { ...mockCategories[index], ...updates };
  }
};

export const updateMockSubCategory = (id: string, updates: Partial<SubCategoryDto>) => {
  const index = mockSubCategories.findIndex((s) => s.id === id);
  if (index !== -1) {
    mockSubCategories[index] = { ...mockSubCategories[index], ...updates };
  }
};

export { mockCategories, mockSubCategories };


