// src/api/Admin/subCategoriesApi.ts
import axios from "axios";

const BASE_URL = "http://localhost:5150/api/Admin";

export interface SubCategoryDto {
  id: string;
  name: string;
  description: string;
  categoryName?: string;
  parentCategoryId: string;
  isActive: boolean;
  createdAt: string;
}

/**
 * Mock delay for demo (remove when backend is live)
 */
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

/**
 * GET /api/Admin/subcategories
 */
export const getSubCategories = async (): Promise<SubCategoryDto[]> => {
  // Mock response until backend is ready
  await delay(500);
  return [
    {
      id: "1",
      name: "Auto Insurance",
      description: "Coverage for vehicles",
      categoryName: "Insurance",
      parentCategoryId: "cat1",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Home Insurance",
      description: "Protection for property",
      categoryName: "Insurance",
      parentCategoryId: "cat1",
      isActive: false,
      createdAt: new Date().toISOString(),
    },
  ];

  // Uncomment this when backend is ready:
  // const res = await axios.get(`${BASE_URL}/subcategories`);
  // return res.data;
};

/**
 * GET /api/Admin/subcategories/{id}
 */
export const getSubCategoryById = async (id: string): Promise<SubCategoryDto> => {
  await delay(300);
  return {
    id,
    name: "Mock Subcategory",
    description: "This is a mock subcategory.",
    parentCategoryId: "cat1",
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  // const res = await axios.get(`${BASE_URL}/subcategories/${id}`);
  // return res.data;
};

/**
 * POST /api/Admin/add-subcategory
 */
export const addSubCategory = async (payload: any) => {
  await delay(400);
  console.log("Mock addSubCategory:", payload);
  return { success: true };
  // const res = await axios.post(`${BASE_URL}/add-subcategory`, payload);
  // return res.data;
};

/**
 * PUT /api/Admin/subcategories/{id}
 */
export const updateSubCategory = async (id: string, payload: any) => {
  await delay(400);
  console.log("Mock updateSubCategory:", id, payload);
  return { success: true };
  // const res = await axios.put(`${BASE_URL}/subcategories/${id}`, payload);
  // return res.data;
};

/**
 * DELETE /api/Admin/subcategories/{id}?forceDelete=false
 */
export const deleteSubCategory = async (id: string, forceDelete = false) => {
  await delay(300);
  console.log("Mock deleteSubCategory:", id, forceDelete);
  return { success: true };
  // const res = await axios.delete(`${BASE_URL}/subcategories/${id}`, { params: { forceDelete } });
  // return res.data;
};
