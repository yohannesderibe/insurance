// // src/api/Admin/categoriesApi.ts
// import axios from "axios";

// const BASE_URL = "http://localhost:5150/api/Admin";

// export interface CategoryDto {
//   id: string;
//   name: string;
//   description: string;
//   pricePerYear: number;
//   imageUrl?: string;
//   isActive: boolean;
//   createdAt: string;
// }

// /**
//  * GET /api/Admin/categories
//  */
// export const getCategories = async (): Promise<CategoryDto[]> => {
//   const res = await axios.get(`${BASE_URL}/categories`);
//   return res.data;
// };

// /**
//  * GET /api/Admin/categories/{id}
//  */
// export const getCategoryById = async (id: string): Promise<CategoryDto> => {
//   const res = await axios.get(`${BASE_URL}/categories/${id}`);
//   return res.data;
// };

// /**
//  * POST /api/Admin/add-category (multipart/form-data)
//  * Accepts FormData with fields: Name, Description, PricePerYear, ImageFile, IsActive, CreatedAt
//  */
// export const addCategory = async (form: FormData) => {
//   const res = await axios.post(`${BASE_URL}/add-category`, form, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return res.data;
// };

// /**
//  * PUT /api/Admin/categories/{id} (multipart/form-data)
//  */
// export const updateCategory = async (id: string, form: FormData) => {
//   const res = await axios.put(`${BASE_URL}/categories/${id}`, form, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   // API returns 204 for success — keep that in mind
//   return res;
// };

// /**
//  * DELETE /api/Admin/categories/{id}?forceDelete=false
//  */
// export const deleteCategory = async (id: string, forceDelete = false) => {
//   const res = await axios.delete(`${BASE_URL}/categories/${id}`, {
//     params: { forceDelete },
//   });
//   return res.data;
// };



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

// ---------------------------------------------------------
// 🌿 Shared Error Handler — tells EXACT backend messages
// ---------------------------------------------------------
const handleApiError = (error: any, message: string) => {
  console.error("--------- API ERROR START ---------");
  console.error(message);

  if (error.response) {
    console.error("📡 Server responded with an error:");
    console.error("Status:", error.response.status);
    console.error("URL:", error.config?.url);
    console.error("Method:", error.config?.method);
    console.error("Response data:", error.response.data);
  } else if (error.request) {
    console.error("🌐 No response received from backend.");
    console.error(error.request);
  } else {
    console.error("🔥 Error before request was sent:", error.message);
  }

  console.error("--------- API ERROR END -----------");

  throw error;
};

// ---------------------------------------------------------
// 🌿 GET ALL CATEGORIES
// GET /api/Admin/categories
// ---------------------------------------------------------
export const getCategories = async (): Promise<CategoryDto[]> => {
  try {
    const res = await axios.get(`${BASE_URL}/get-maincategory`);
    return res.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch categories");
  }
};

// ---------------------------------------------------------
// 🌿 GET CATEGORY BY ID
// GET /api/Admin/categories/{id}
// ---------------------------------------------------------
export const getCategoryById = async (id: string): Promise<CategoryDto> => {
  try {
    const res = await axios.get(`${BASE_URL}/categories/${id}`);
    return res.data;
  } catch (error) {
    handleApiError(error, `Failed to fetch category with ID: ${id}`);
  }
};

// ---------------------------------------------------------
// 🌿 ADD CATEGORY
// POST /api/Admin/add-category  (multipart/form-data)
// ---------------------------------------------------------
export const addCategory = async (form: FormData) => {
  try {
    const res = await axios.post(`${BASE_URL}/add-maincategory`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

   
    return res.data;
  } catch (error) {
    handleApiError(error, "Failed to create category");
  }
};

// ---------------------------------------------------------
// 🌿 UPDATE CATEGORY
// PUT /api/Admin/categories/{id}
// ---------------------------------------------------------
export const updateCategory = async (id: string, form: FormData) => {
  try {
    const res = await axios.put(`${BASE_URL}/categories/${id}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res;
  } catch (error) {
    handleApiError(error, `Failed to update category with ID: ${id}`);
  }
};

// ---------------------------------------------------------
// 🌿 DELETE CATEGORY
// DELETE /api/Admin/categories/{id}?forceDelete=false
// ---------------------------------------------------------
export const deleteCategory = async (id: string, forceDelete = false) => {
  try {
    const res = await axios.delete(`${BASE_URL}/categories/${id}`, {
      params: { forceDelete },
    });
    return res.data;
  } catch (error) {
    handleApiError(error, `Failed to delete category with ID: ${id}`);
  }
};
