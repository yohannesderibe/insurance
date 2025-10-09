// src/api/Admin/categoriesApi.ts
import axios from "axios";

const BASE_URL = "http://localhost:5150/api/Admin";

export interface CategoryDto {
  id: string;
  name: string;
  description: string;
  pricePerYear: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
}

/**
 * GET /api/Admin/categories
 */
export const getCategories = async (): Promise<CategoryDto[]> => {
  const res = await axios.get(`${BASE_URL}/categories`);
  return res.data;
};

/**
 * GET /api/Admin/categories/{id}
 */
export const getCategoryById = async (id: string): Promise<CategoryDto> => {
  const res = await axios.get(`${BASE_URL}/categories/${id}`);
  return res.data;
};

/**
 * POST /api/Admin/add-category (multipart/form-data)
 * Accepts FormData with fields: Name, Description, PricePerYear, ImageFile, IsActive, CreatedAt
 */
export const addCategory = async (form: FormData) => {
  const res = await axios.post(`${BASE_URL}/add-category`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/**
 * PUT /api/Admin/categories/{id} (multipart/form-data)
 */
export const updateCategory = async (id: string, form: FormData) => {
  const res = await axios.put(`${BASE_URL}/categories/${id}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  // API returns 204 for success — keep that in mind
  return res;
};

/**
 * DELETE /api/Admin/categories/{id}?forceDelete=false
 */
export const deleteCategory = async (id: string, forceDelete = false) => {
  const res = await axios.delete(`${BASE_URL}/categories/${id}`, {
    params: { forceDelete },
  });
  return res.data;
};

