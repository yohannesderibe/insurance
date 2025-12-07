import axios from "axios";

const BASE_URL = "http://localhost:5150/api/Admin";

export interface SubCategoryDto {
  id: string;
  name: string;
  description: string;
  fullInsurancePercentage: number | null;
  thirdPartyPercentage: number | null;
  imageUrl: string | null;
  parentId: string | null;
  isActive: boolean;
  createdAt: string;
}

/**
 * GET subcategories for a specific parent category
 * Correct URL: /api/Admin/{parentId}/get-subcategory
 */
export const getSubCategories = async (parentId: string): Promise<SubCategoryDto[]> => {
  try {
    const res = await axios.get(`${BASE_URL}/${parentId}/get-subcategory`);
    return res.data;
  } catch (error: any) {
    console.error("Failed to fetch subcategories:", error);
    if (error.response) console.error(error.response.data);
    throw error;
  }
};

/**
 * GET subcategory by ID
 * GET /api/Admin/{id}/get-categorybyid
 */
export const getSubCategoryById = async (id: string): Promise<SubCategoryDto> => {
  try {
    const res = await axios.get(`${BASE_URL}/${id}/get-categorybyid`);
    return res.data;
  } catch (error: any) {
    console.error(`Failed to fetch subcategory ${id}:`, error);
    if (error.response) console.error(error.response.data);
    throw error;
  }
};

/**
 * POST add subcategory to a specific parent category
 * Correct URL: /api/Admin/{parentId}/add-subcategory
 */
export const addSubCategory = async (formData: FormData, parentId: string) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/${parentId}/add-subcategory`,
      formData,
      { 
        headers: { 
          "Content-Type": "multipart/form-data",
          "Accept": "*/*"
        } 
      }
    );
    return res.data;
  } catch (error: any) {
    console.error("Failed to add subcategory:", error);
    if (error.response) {
      console.error("Error status:", error.response.status);
      console.error("Error data:", error.response.data);
    }
    throw error;
  }
};

/**
 * PUT update subcategory
 * PUT /api/Admin/update-subcategory/{id}
 */
export const updateSubCategory = async (id: string, formData: FormData) => {
  try {
    const res = await axios.put(
      `${BASE_URL}/update-subcategory/${id}`, // You need to verify this endpoint
      formData,
      { 
        headers: { 
          "Content-Type": "multipart/form-data",
          "Accept": "*/*"
        } 
      }
    );
    return res.data;
  } catch (error: any) {
    console.error(`Failed to update subcategory ${id}:`, error);
    if (error.response) console.error(error.response.status, error.response.data);
    throw error;
  }
};

/**
 * DELETE subcategory
 * DELETE /api/Admin/delete-subcategory/{id}
 */
export const deleteSubCategory = async (id: string, forceDelete = false) => {
  try {
    const res = await axios.delete(`${BASE_URL}/delete-subcategory/${id}`, {
      params: { forceDelete },
      headers: { "Accept": "*/*" }
    });
    return res.data;
  } catch (error: any) {
    console.error(`Failed to delete subcategory ${id}:`, error);
    if (error.response) console.error(error.response.status, error.response.data);
    throw error;
  }
};