import axios from "axios";

const API_URL = "http://localhost:5150/api/Admin";

// ==========================
// GET MAIN CATEGORIES
// ==========================
export const getCustomerCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-maincategory`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
};

// ==========================
// GET SUBCATEGORIES BY MAIN CATEGORY ID
// ==========================
export const getSubcategoriesByCategory = async (parentId: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/${parentId}/get-subcategory`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch subcategories:", error);
    return [];
  }
};
 