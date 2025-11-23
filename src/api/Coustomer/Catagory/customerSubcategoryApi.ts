import { mockSubcategories } from "../../../mockdata/subcategories";

export const getSubcategoriesByCategory = async (categoryId: number) => {
  // 🔜 Replace with backend API (GET /api/categories/:id/subcategories)
  return Promise.resolve(mockSubcategories.filter(s => s.categoryId === categoryId));
};




// import axios from "axios";

// const API_URL = "http://localhost:5150/api/Admin";

// export const getSubcategoriesByCategory = async (parentId: string) => {
//   try {
//     const response = await axios.get(`${API_URL}/${parentId}/get-subcategory`);
//     return response.data;
//   } catch (error) {
//     console.error("Failed to load subcategories:", error);
//     throw error;
//   }
// };

// export const addSubcategory = async (parentId: string, data: any) => {
//   try {
//     const formData = new FormData();

//     formData.append("Name", data.name);
//     formData.append("Description", data.description);
//     // Backend typo: "PricePerYear" — send but you will change later
//     formData.append("PricePerYear", data.basePrice);
//     formData.append("IsActive", String(data.isActive));
//     formData.append("CreatedAt", new Date().toISOString());

//     if (data.imageFile) {
//       formData.append("ImageFile", data.imageFile);
//     }

//     const response = await axios.post(
//       `${API_URL}/${parentId}/add-subcategory`,
//       formData,
//       { headers: { "Content-Type": "multipart/form-data" } }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Failed to add subcategory:", error);
//     throw error;
//   }
// };
